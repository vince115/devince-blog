//next.config.ts
import type { NextConfig } from "next";
import { withContentlayer } from "next-contentlayer";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
};

export default withContentlayer(nextConfig);
