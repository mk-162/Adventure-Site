import { NextResponse } from "next/server";
import { getItineraries } from "@/lib/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit")
    ? parseInt(searchParams.get("limit")!)
    : undefined;
  const regionId = searchParams.get("regionId")
    ? parseInt(searchParams.get("regionId")!)
    : undefined;

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
