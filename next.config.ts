import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/pokemon-champions",
  assetPrefix: "/pokemon-champions",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
