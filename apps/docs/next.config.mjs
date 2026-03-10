import { createMDX } from "fumadocs-mdx/next";

const nextConfig = {
  reactStrictMode: true,
};

const withMDX = createMDX();

export default withMDX(nextConfig);
