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
    ];
  },
};

export default nextConfig;
