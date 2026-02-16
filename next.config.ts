import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: "https", hostname: "ui-lib.com" },
      { protocol: "https", hostname: "box.taavoni.online" },
      { protocol: "https", hostname: "api.taavoni.online" },
      { protocol: "https", hostname: "img.taavoni.online" },
    ],
  },
};

export default withBundleAnalyzer(nextConfig);
