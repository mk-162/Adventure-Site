import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

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

    // Ensure table exists
    await sql`
      CREATE TABLE IF NOT EXISTS operator_interest (
        id SERIAL PRIMARY KEY,
        business_name VARCHAR(255) NOT NULL,
        contact_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        num_locations INTEGER DEFAULT 1,
        plan_interest VARCHAR(50),
        message TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;

    await sql`
      INSERT INTO operator_interest (business_name, contact_name, email, phone, num_locations, plan_interest, message)
      VALUES (
        ${businessName},
        ${contactName},
        ${email.toLowerCase()},
        ${phone || null},
        ${numLocations || 1},
        ${planInterest || 'free'},
        ${message || null}
      )
    `;

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Operator interest error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
