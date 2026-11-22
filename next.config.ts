import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow ngrok tunnels so dev HMR / cross-origin requests aren't blocked.
  allowedDevOrigins: ["*.ngrok-free.app"],
};

export default nextConfig;
