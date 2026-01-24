import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  devIndicators: {
    position: 'bottom-right',
  },
  // Static export does not support rewrites.
  // API requests must use the full URL defined in NEXT_PUBLIC_API_URL.
  /*
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "/api/index.py",
      },
    ];
  },
  */
};

export default nextConfig;
