import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lean, self-contained server bundle for Docker (only traced runtime deps).
  output: "standalone",
  images: {
    // Firebase Storage will be added here later, e.g.:
    // remotePatterns: [{ protocol: "https", hostname: "firebasestorage.googleapis.com" }],
  },
};

export default nextConfig;
