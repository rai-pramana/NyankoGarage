import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow dev access from local network devices
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://192.168.1.3:3000',
    'http://192.168.1.10:3000',
    '192.168.1.3',
    '192.168.1.10',
  ],
};

export default nextConfig;
