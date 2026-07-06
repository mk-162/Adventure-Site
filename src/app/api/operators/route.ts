import { NextResponse } from "next/server";
import { getOperators } from "@/lib/queries";

// Public projection — never return billing/Stripe/admin columns from this route.
function toPublicOperator(op: Awaited<ReturnType<typeof getOperators>>["operators"][number]) {
  return {
    id: op.id,
    name: op.name,
    slug: op.slug,
    type: op.type,
    category: op.category,
    website: op.website,
    email: op.email,
    phone: op.phone,
    address: op.address,
    lat: op.lat,
    lng: op.lng,
    description: op.description,
    tagline: op.tagline,
    logoUrl: op.logoUrl,
    coverImage: op.coverImage,
    googleRating: op.googleRating,
    reviewCount: op.reviewCount,
    tripadvisorUrl: op.tripadvisorUrl,
    priceRange: op.priceRange,
    uniqueSellingPoint: op.uniqueSellingPoint,
    trustSignals: op.trustSignals,
    serviceTypes: op.serviceTypes,
    regions: op.regions,
    activityTypes: op.activityTypes,
    groupFriendly: op.groupFriendly,
    groupMinSize: op.groupMinSize,
    groupMaxSize: op.groupMaxSize,
    groupPriceFrom: op.groupPriceFrom,
    youtubeVideoId: op.youtubeVideoId,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawLimit = parseInt(searchParams.get("limit") ?? "", 10);
  const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 100) : undefined;

  try {
    const { operators } = await getOperators({ limit });
    return NextResponse.json(operators.map(toPublicOperator));
  } catch (error) {
    console.error("Error fetching operators:", error);
    return NextResponse.json(
      { error: "Failed to fetch operators" },
      { status: 500 }
    );
  }
}
