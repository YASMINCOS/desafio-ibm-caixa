import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  images: {
    remotePatterns: [
      new URL(
        "https://images.unsplash.com/photo-1494790108755-2616b2f85095?w=100&h=100&fit=crop&crop=face"
      ),
    ],
  },
};

export default nextConfig;
