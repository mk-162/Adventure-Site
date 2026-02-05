import { NextResponse } from "next/server";
import { db } from "@/db";
import { outreachRecipients, outreachCampaigns } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const recipientId = searchParams.get("r");

  if (recipientId) {
    try {
        const id = parseInt(recipientId);
        if (!isNaN(id)) {
            // Check if already opened to avoid double counting
            const recipient = await db.select().from(outreachRecipients).where(eq(outreachRecipients.id, id)).limit(1);

            if (recipient[0]) {
                // Update recipient status and timestamp
                await db.update(outreachRecipients)
                    .set({
                        status: "opened",
                        openedAt: recipient[0].openedAt || new Date() // Keep original open time if already opened? Usually we want first open.
                    })
                    .where(eq(outreachRecipients.id, id));

                if (!recipient[0].openedAt) {
                    await db.update(outreachCampaigns)
                        .set({ openedCount: sql`${outreachCampaigns.openedCount} + 1` })
                        .where(eq(outreachCampaigns.id, recipient[0].campaignId));
                }
            }
        }
    } catch (error) {
        console.error("Tracking error", error);
    }
  }

  // Return 1x1 transparent GIF
  const pixel = Buffer.from(
    "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
    "base64"
  );

  return new NextResponse(pixel, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });
}
