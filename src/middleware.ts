import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

const JWT_SECRET_RAW = process.env.JWT_SECRET || process.env.ADMIN_SECRET || "dev-secret";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Don't protect the login page itself
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Protect admin pages AND admin API routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const adminPassword =
      process.env.ADMIN_PASSWORD || process.env.ADMIN_SECRET;

    // If no password is set, allow access (dev mode)
    if (!adminPassword) {
      return NextResponse.next();
    }

    // Check for admin token in cookies
    const adminToken = request.cookies.get("admin_token")?.value;

    if (adminToken) {
      // Try JWT verification first
      try {
        const secret = new TextEncoder().encode(JWT_SECRET_RAW);
        const { payload } = await jose.jwtVerify(adminToken, secret);
        if (payload.id !== undefined && payload.email) {
          // Valid JWT session — add user info to headers for downstream use
          const response = NextResponse.next();
          response.headers.set("x-admin-email", payload.email as string);
          response.headers.set("x-admin-role", (payload.role as string) || "viewer");
          return response;
        }
      } catch {
        // Not a valid JWT — try legacy
      }

      // Legacy: raw password match
      if (adminToken === adminPassword) {
        return NextResponse.next();
      }
    }

    // Check for basic auth header (useful for API/programmatic access)
    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      const base64Credentials = authHeader.split(" ")[1];
      if (base64Credentials) {
        const credentials = Buffer.from(base64Credentials, "base64").toString(
          "ascii"
        );
        const [, password] = credentials.split(":");

        if (password === adminPassword) {
          const response = NextResponse.next();
          response.cookies.set("admin_token", adminPassword, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
          });
          return response;
        }
      }
    }

    // For API routes, return 401 with basic auth challenge
    if (pathname.startsWith("/api/")) {
      return new NextResponse("Authentication required", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="Admin Area"' },
      });
    }

    // For pages, redirect to login
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
