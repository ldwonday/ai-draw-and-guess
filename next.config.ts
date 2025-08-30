import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 为Vercel部署配置图片优化
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
