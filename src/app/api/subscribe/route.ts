import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(request: NextRequest) {
  try {
    const { email, source } = await request.json();

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Check for existing subscriber
    const existing = await sql`
      SELECT id FROM subscribers WHERE email = ${email.toLowerCase()}
    `;

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: "You're already subscribed!" },
        { status: 400 }
      );
    }

    // Insert new subscriber
    await sql`
      INSERT INTO subscribers (email, source, created_at)
      VALUES (${email.toLowerCase()}, ${source || 'website'}, NOW())
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Subscribe error:", error);
    
    // If table doesn't exist, create it and retry
    if (error.message?.includes("relation \"subscribers\" does not exist")) {
      try {
        await sql`
          CREATE TABLE IF NOT EXISTS subscribers (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            source VARCHAR(100),
            created_at TIMESTAMP DEFAULT NOW()
          )
        `;
        
        const { email, source } = await request.json().catch(() => ({}));
        if (email) {
          await sql`
            INSERT INTO subscribers (email, source, created_at)
            VALUES (${email.toLowerCase()}, ${source || 'website'}, NOW())
          `;
          return NextResponse.json({ success: true });
        }
      } catch {
        // Fall through to generic error
      }
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
