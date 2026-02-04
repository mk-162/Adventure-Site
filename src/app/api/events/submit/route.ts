import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { events, operators, sites } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getOperatorSession } from "@/lib/auth";

// Helper to get site ID
async function getSiteId() {
  const site = await db.select().from(sites).limit(1);
  return site[0]?.id || 1;
}

// Helper to generate unique slug
async function generateUniqueSlug(baseSlug: string) {
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const existing = await db.select().from(events).where(eq(events.slug, slug)).limit(1);
    if (existing.length === 0) return slug;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getOperatorSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    // Validate data (basic validation)
    if (!data.name || !data.dateStart) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check billing tier for promotion
    const operator = await db.query.operators.findFirst({
        where: eq(operators.id, session.operatorId),
    });

    if (!operator) return NextResponse.json({ error: "Operator not found" }, { status: 404 });

    const isPromoted = data.promote === true;
    let promotedUntil = null;

    if (isPromoted) {
        if (!['verified', 'premium'].includes(operator.billingTier || '')) {
            return NextResponse.json({ error: "Upgrade required to promote events" }, { status: 403 });
        }
        // Set promoted until 30 days from now
        const d = new Date();
        d.setDate(d.getDate() + 30);
        promotedUntil = d;
    }

    const siteId = await getSiteId();
    const baseSlug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const uniqueSlug = await generateUniqueSlug(baseSlug);

    const [newEvent] = await db.insert(events).values({
      siteId,
      operatorId: session.operatorId,
      name: data.name,
      slug: uniqueSlug,
      description: data.description,
      type: data.type,
      category: data.category,
      dateStart: new Date(data.dateStart),
      dateEnd: data.dateEnd ? new Date(data.dateEnd) : null,
      location: data.location,
      lat: data.lat ? data.lat.toString() : null,
      lng: data.lng ? data.lng.toString() : null,
      website: data.website,
      ticketUrl: data.ticketUrl,
      registrationCost: data.registrationCost ? data.registrationCost.toString() : null,
      capacity: data.capacity ? parseInt(data.capacity) : null,
      difficulty: data.difficulty,
      ageRange: data.ageRange,
      heroImage: data.heroImage,
      status: 'draft', // Always draft initially
      isPromoted,
      promotedUntil,
    }).returning({ id: events.id });

    return NextResponse.json({ success: true, eventId: newEvent.id });

  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
