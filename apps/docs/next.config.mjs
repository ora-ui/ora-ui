import { createMDX } from 'fumadocs-mdx/next';

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['@phosphor-icons/react'],
    turbopack: {
      root: import.meta.dirname,
    },
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
