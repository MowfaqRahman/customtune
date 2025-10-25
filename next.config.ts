import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  compiler: {
    styledComponents: true,
  },
  transpilePackages: ["lucide-react"],
  serverComponentsExternalPackages: ["@supabase/supabase-js"],
};

export default nextConfig;
