import { createMDX } from 'fumadocs-mdx/next';

const nextConfig = {
  // Lets a second `next dev` (e.g. the verify-ora-www skill) run beside yours.
  distDir: process.env.NEXT_DIST_DIR || '.next',
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
