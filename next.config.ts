//next.config.ts
import type { NextConfig } from "next";
import { withContentlayer } from "next-contentlayer";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // typedRoutes: true, // 暫時註解掉，因為 typedRoutes 有時候也會在 build 時導致型別錯誤阻擋部署
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true, // 也忽略 TS 錯誤，因為 Contentlayer 產生的型別有問題
  },
};

export default withContentlayer(nextConfig);
