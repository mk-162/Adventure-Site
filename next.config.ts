import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Externalize heavy packages to reduce serverless function size
  serverExternalPackages: ['sharp', 'openai', '@img/sharp-linux-x64', 'stripe'],
  
  // Reduce bundle size
  experimental: {
    optimizePackageImports: ['lucide-react', 'drizzle-orm'],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  outputFileTracingExcludes: {
    "*": ["./public/images/**"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            // Report-only: tighten to enforcing in Phase 6 after reviewing reports
            key: "Content-Security-Policy-Report-Only",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https:",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/for-operators',
        destination: '/advertise',
        permanent: true,
      },
      {
        source: '/activities/stag-hen',
        destination: '/stag-hen',
        permanent: true,
      },
      // Activity hub redirects - old routes to new hub pages
      {
        source: '/activities/type/:slug',
        destination: '/:slug',
        permanent: true,
      },
      {
        source: '/activities/:slug',
        destination: '/:slug',
        permanent: true,
      },
      // SUP redirect to paddleboarding
      {
        source: '/sup',
        destination: '/paddleboarding',
        permanent: true,
      },
      {
        source: '/sea-kayaking',
        destination: '/kayaking',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
