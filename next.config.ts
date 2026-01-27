import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    browserDebugInfoInTerminal: true,
  },
  output: 'standalone',
};

export default nextConfig;
