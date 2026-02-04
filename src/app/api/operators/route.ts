import { NextResponse } from "next/server";
import { getOperators } from "@/lib/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit")
    ? parseInt(searchParams.get("limit")!)
    : undefined;

  try {
    const operators = await getOperators({ limit });
    return NextResponse.json(operators);
  } catch (error) {
    console.error("Error fetching operators:", error);
    return NextResponse.json(
      { error: "Failed to fetch operators" },
      { status: 500 }
    );
  }
}
