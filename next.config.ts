import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [{ source: '/', destination: '/en' }];
  },
  async redirects() {
    return [{ source: '/en', destination: '/', permanent: true }];
  },
};

export default nextConfig;
