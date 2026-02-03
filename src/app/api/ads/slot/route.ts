import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { adCreatives, adCampaigns, pageAds, operators } from "@/db/schema";
import { eq, and, gte, lte, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const slotName = searchParams.get("name");
  const pageType = searchParams.get("pageType");
  const pageSlug = searchParams.get("pageSlug");

  if (!slotName || !pageType) {
    return NextResponse.json(
      { error: "Missing required parameters: name and pageType" },
      { status: 400 }
    );
  }

  try {
    const now = new Date();

    // Priority 1: Check for direct campaign targeting this slot
    const directCampaign = await db
      .select({
        imageUrl: adCreatives.imageUrl,
        linkUrl: adCreatives.linkUrl,
        altText: adCreatives.altText,
      })
      .from(adCreatives)
      .innerJoin(adCampaigns, eq(adCreatives.campaignId, adCampaigns.id))
      .where(
        and(
          eq(adCreatives.slotType, slotName),
          eq(adCreatives.status, "published"),
          eq(adCampaigns.status, "active"),
          lte(adCampaigns.startDate, now),
          gte(adCampaigns.endDate, now)
        )
      )
      .orderBy(sql`RANDOM()`)
      .limit(1);

    if (directCampaign.length > 0) {
      return NextResponse.json({
        creative: directCampaign[0],
        source: "direct",
      });
    }

    // Priority 2: Check for page-specific ads
    if (pageSlug) {
      const pageAd = await db
        .select()
        .from(pageAds)
        .where(
          and(
            eq(pageAds.pageType, pageType),
            eq(pageAds.pageSlug, pageSlug)
          )
        )
        .limit(1);

      if (pageAd.length > 0) {
        const adConfig = pageAd[0];
        // Check if this slot has a configured ad in the JSON
        const slotConfig = (adConfig as any)[slotName.replace("-", "_")];
        if (slotConfig) {
          return NextResponse.json({
            creative: slotConfig,
            source: "page_specific",
          });
        }
      }
    }

    // Priority 3: Premium operator spotlight (for operator_spotlight slots)
    if (slotName.includes("operator") || slotName.includes("spotlight")) {
      const premiumOperator = await db
        .select({
          imageUrl: operators.coverImage,
          linkUrl: sql<string>`'/directory/' || ${operators.slug}`,
          altText: operators.name,
          operatorName: operators.name,
          operatorLogo: operators.logoUrl,
        })
        .from(operators)
        .where(eq(operators.claimStatus, "premium"))
        .orderBy(sql`RANDOM()`)
        .limit(1);

      if (premiumOperator.length > 0 && premiumOperator[0].imageUrl) {
        return NextResponse.json({
          creative: {
            imageUrl: premiumOperator[0].imageUrl,
            linkUrl: premiumOperator[0].linkUrl,
            altText: `${premiumOperator[0].altText} - Premium Partner`,
          },
          sponsor: {
            name: premiumOperator[0].operatorName,
            logo: premiumOperator[0].operatorLogo,
          },
          source: "premium_operator",
        });
      }
    }

    // No ad available
    return NextResponse.json({ creative: null });
  } catch (error) {
    console.error("Error fetching ad:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
