import { NextRequest, NextResponse } from "next/server";
import { clearOperatorSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  await clearOperatorSession();
  return NextResponse.redirect(new URL("/", req.url));
}
