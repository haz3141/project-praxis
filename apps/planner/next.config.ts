import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@praxis/supabase", "@praxis/ui"]
};

export default nextConfig;
