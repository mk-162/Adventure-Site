import { NextResponse } from "next/server";
import { getItineraries } from "@/lib/queries";
import { parseIntQueryParam } from "@/lib/api/validate";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const limitParam = parseIntQueryParam(searchParams, "limit", { max: 100 });
  if (!limitParam.ok) return limitParam.response;
  const regionIdParam = parseIntQueryParam(searchParams, "regionId");
  if (!regionIdParam.ok) return regionIdParam.response;

  const limit = limitParam.value;
  const regionId = regionIdParam.value;

  try {
    const itineraries = await getItineraries({ limit, regionId });
    return NextResponse.json(itineraries);
  } catch (error) {
    console.error("Error fetching itineraries:", error);
    return NextResponse.json(
      { error: "Failed to fetch itineraries" },
      { status: 500 }
    );
  }
}
