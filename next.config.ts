import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.70'],

  // Externalize heavy packages to reduce serverless function size
  serverExternalPackages: ['sharp', '@img/sharp-linux-x64', 'stripe'],
  
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
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
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
            // Enforcing. script-src keeps 'unsafe-inline' because the site is
            // statically generated (per-request nonces would force dynamic
            // rendering); 'unsafe-eval' is dev-only for the bundler runtime.
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              process.env.NODE_ENV === "development"
                ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
                : "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' blob: data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https:",
              // YouTube embeds (VideoEmbed component)
              "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests",
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
      // NOTE: do NOT add wildcard redirects under /activities — they shadow the
      // real routes /activities/[slug] and /activities/type/[type] (config
      // redirects run before filesystem routing), 404ing every activity link.
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
