import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { events, sites, regions } from "@/db/schema";
import { eq } from "drizzle-orm";

// Helper to get site ID (assuming single site for now or default)
async function getSiteId() {
  const site = await db.select().from(sites).limit(1);
  return site[0]?.id || 1;
}

// Helper to find a region (naive matching)
async function findRegionId(address: string | null) {
  if (!address) return null;
  const allRegions = await db.select().from(regions);
  // Simple check if region name is in address
  const match = allRegions.find(r => address.toLowerCase().includes(r.name.toLowerCase()));
  return match?.id || null;
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-admin-secret");
  // Simple guard, in prod ensure ADMIN_SECRET is set
  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { source } = body;

  if (source === "eventbrite") {
    const token = process.env.EVENTBRITE_TOKEN;
    if (!token) {
        return NextResponse.json({
            error: "EVENTBRITE_TOKEN environment variable is not set"
        }, { status: 500 });
    }

    try {
        const response = await fetch(
            `https://www.eventbriteapi.com/v3/events/search/?location.address=Wales&categories=108&token=${token}`
        );

        if (!response.ok) {
            throw new Error(`EventBrite API error: ${response.statusText}`);
        }

        const data = await response.json();
        const ebEvents = data.events || [];
        let imported = 0;
        let skipped = 0;
        const siteId = await getSiteId();

        for (const ev of ebEvents) {
            // Check if exists
            const existing = await db
                .select()
                .from(events)
                .where(eq(events.externalId, ev.id))
                .limit(1);

            if (existing.length > 0) {
                skipped++;
                continue;
            }

            // Map fields
            const regionId = await findRegionId(ev.venue?.address?.localized_address_display || "");

            await db.insert(events).values({
                siteId,
                regionId,
                name: ev.name.text,
                slug: `eb-${ev.id}`, // Simple slug generation
                description: ev.description.text,
                dateStart: new Date(ev.start.local),
                dateEnd: new Date(ev.end.local),
                externalSource: 'eventbrite',
                externalId: ev.id,
                externalUrl: ev.url,
                heroImage: ev.logo?.url,
                location: ev.venue?.address?.localized_address_display,
                status: 'draft', // Require review
                type: 'Event', // Generic type
            });
            imported++;
        }

        return NextResponse.json({ imported, skipped });

    } catch (error) {
        console.error("Ingestion error:", error);
        return NextResponse.json({ error: "Ingestion failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Invalid source" }, { status: 400 });
}
