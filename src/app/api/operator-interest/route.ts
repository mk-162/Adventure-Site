import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { operatorInterest } from "@/db/schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessName, contactName, email, phone, numLocations, planInterest, message } = body;

    // Validate required fields
    if (!businessName || !contactName || !email) {
      return NextResponse.json(
        { error: "Business name, contact name, and email are required." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

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
