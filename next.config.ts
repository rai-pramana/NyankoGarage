import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow dev access from local network devices
  allowedDevOrigins: [
    'localhost:3000',
    '192.168.1.10:3000',
  ],
};

export default nextConfig;
