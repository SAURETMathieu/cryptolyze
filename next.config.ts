import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    resolveExtensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      {
        protocol: "http",
        hostname: "limitedresell.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "limitedresell.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.stockx.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
