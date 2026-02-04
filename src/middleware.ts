import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply to admin routes
  if (pathname.startsWith("/admin")) {
    const adminSecret = process.env.ADMIN_SECRET;

    // If no ADMIN_SECRET is set, allow access (dev mode)
    if (!adminSecret) {
      return NextResponse.next();
    }

    // Check for admin token in cookies
    const adminToken = request.cookies.get("admin_token")?.value;

    // If token matches secret, allow access
    if (adminToken === adminSecret) {
      return NextResponse.next();
    }

    // Check for basic auth header
    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      const base64Credentials = authHeader.split(" ")[1];
      const credentials = Buffer.from(base64Credentials, "base64").toString("ascii");
      const [username, password] = credentials.split(":");

      // Simple check: username can be anything, password must match ADMIN_SECRET
      if (password === adminSecret) {
        // Set cookie for future requests
        const response = NextResponse.next();
        response.cookies.set("admin_token", adminSecret, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });
        return response;
      }
    }

    // Require authentication
    return new NextResponse("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Admin Area"',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
