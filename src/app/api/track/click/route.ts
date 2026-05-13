import { NextResponse } from "next/server";
import { db } from "@/db";
import { outreachRecipients, outreachCampaigns } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { trackClickQuerySchema, validateSearchParams } from "@/lib/api/validate";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const v = validateSearchParams(searchParams, trackClickQuerySchema);
  if (!v.ok) return v.response;
  const { r: recipientId, url: destinationUrl } = v.data;

  if (recipientId) {
    try {
        const id = parseInt(recipientId);
        if (!isNaN(id)) {
            const recipient = await db.select().from(outreachRecipients).where(eq(outreachRecipients.id, id)).limit(1);

            if (recipient[0]) {
                 await db.update(outreachRecipients)
                    .set({
                        status: "clicked",
                        clickedAt: recipient[0].clickedAt || new Date(),
                        // If not opened yet, mark as opened too
                        openedAt: recipient[0].openedAt || new Date()
                    })
                    .where(eq(outreachRecipients.id, id));

                 if (!recipient[0].clickedAt) {
                    await db.update(outreachCampaigns)
                        .set({ clickedCount: sql`${outreachCampaigns.clickedCount} + 1` })
                        .where(eq(outreachCampaigns.id, recipient[0].campaignId));
                 }

                 // Also ensure opened count is accurate if they clicked without loading image
                 if (!recipient[0].openedAt) {
                    await db.update(outreachCampaigns)
                        .set({ openedCount: sql`${outreachCampaigns.openedCount} + 1` })
                        .where(eq(outreachCampaigns.id, recipient[0].campaignId));
                 }
            }
        }
    } catch (error) {
        console.error("Click tracking error", error);
    }
  }

  return NextResponse.redirect(destinationUrl);
}
