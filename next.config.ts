import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/portal/admin/competition",
        destination: "/portal/competition",
        permanent: true,
      },
      {
        source: "/portal/admin/promo-codes",
        destination: "/portal/promo-codes",
        permanent: true,
      },
      { source: "/portal/admin", destination: "/portal", permanent: true },
      { source: "/portal/admin/:path*", destination: "/portal", permanent: true },
      { source: "/portal/gyms/:path*", destination: "/portal", permanent: true },
      { source: "/portal/clubs/:path*", destination: "/portal", permanent: true },
      { source: "/portal/coaches/:path*", destination: "/portal", permanent: true },
    ];
  },
};

export default nextConfig;
