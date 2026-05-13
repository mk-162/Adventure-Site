import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { operatorInterest } from "@/db/schema";
import { operatorInterestSchema, validateJsonBody } from "@/lib/api/validate";

export async function POST(request: NextRequest) {
  try {
    const v = await validateJsonBody(request, operatorInterestSchema);
    if (!v.ok) return v.response;

    const {
      businessName,
      contactName,
      email,
      phone,
      numLocations,
      planInterest,
      message,
    } = v.data;

    await db.insert(operatorInterest).values({
      businessName,
      contactName,
      email: email.toLowerCase(),
      phone: phone ?? null,
      numLocations: numLocations ?? 1,
      planInterest: planInterest ?? "free",
      message: message ?? null,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Operator interest error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
