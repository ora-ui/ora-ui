import { createMDX } from 'fumadocs-mdx/next';

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['@phosphor-icons/react'],
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
