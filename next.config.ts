import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
