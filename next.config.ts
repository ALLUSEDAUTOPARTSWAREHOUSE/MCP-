import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The image optimizer endpoint (/_next/image) is unavailable in this
    // environment and returns 404, which breaks every <Image>. Serving the
    // original files directly makes images render reliably on all devices.
    unoptimized: true,
  },
};

export default nextConfig;
