import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Any other Next.js config options can go here
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname),
    };
    return config;
  },
};

export default nextConfig;
