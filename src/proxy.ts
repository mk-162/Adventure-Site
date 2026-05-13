import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

const _JWT_SECRET_RAW = process.env.JWT_SECRET || process.env.ADMIN_SECRET;
if (!_JWT_SECRET_RAW && process.env.NODE_ENV === "production") {
  throw new Error("JWT_SECRET or ADMIN_SECRET must be set in production");
}
if (!_JWT_SECRET_RAW) {
  console.warn("[middleware] JWT_SECRET is not set — admin JWT verification will fail");
}
const JWT_SECRET_RAW = _JWT_SECRET_RAW ?? "";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Don't protect the login page itself
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Protect admin pages AND admin API routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const adminPassword =
      process.env.ADMIN_PASSWORD || process.env.ADMIN_SECRET;

    // Fail closed: if no secret is configured, deny all admin access.
    // In dev you must still set ADMIN_PASSWORD (or ALLOW_OPEN_ADMIN_DEV=1).
    if (!adminPassword) {
      if (
        process.env.NODE_ENV !== "production" &&
        process.env.ALLOW_OPEN_ADMIN_DEV === "1"
      ) {
        return NextResponse.next();
      }
      const body = JSON.stringify({ error: "Admin is not configured on this server" });
      if (pathname.startsWith("/api/")) {
        return new NextResponse(body, {
          status: 503,
          headers: { "Content-Type": "application/json" },
        });
      }
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("error", "misconfigured");
      return NextResponse.redirect(loginUrl);
    }

    // JWT-only verification — no legacy password-as-cookie path
    const adminToken = request.cookies.get("admin_token")?.value;
    if (adminToken) {
      try {
        const secret = new TextEncoder().encode(JWT_SECRET_RAW);
        const { payload } = await jose.jwtVerify(adminToken, secret);
        if (payload.id !== undefined && payload.email) {
          const response = NextResponse.next();
          response.headers.set("x-admin-email", payload.email as string);
          response.headers.set("x-admin-role", (payload.role as string) || "viewer");
          return response;
        }
      } catch {
        // Invalid or expired JWT — fall through to deny
      }
    }

    // For API routes, return 401
    if (pathname.startsWith("/api/")) {
      return new NextResponse(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
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
