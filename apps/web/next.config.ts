import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Next validates the application with the TS6 compatibility API. The
    // workspace typecheck command still runs the TypeScript 7 native CLI.
    useTypeScriptCli: false,
  },
  poweredByHeader: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com" }],
  },
  transpilePackages: [
    "@aprendevest/contracts",
    "@aprendevest/db",
    "@aprendevest/domain",
  ],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; frame-src 'self' https://www.youtube.com; object-src 'none'; img-src 'self' data: https:; media-src 'self' https:; font-src 'self' data:; connect-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; upgrade-insecure-requests",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
