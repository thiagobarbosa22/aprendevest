import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Next validates the application with the TS6 compatibility API. The
    // workspace typecheck command still runs the TypeScript 7 native CLI.
    useTypeScriptCli: false,
  },
  poweredByHeader: false,
  transpilePackages: [
    "@aprendevest/contracts",
    "@aprendevest/db",
    "@aprendevest/domain",
  ],
};

export default nextConfig;
