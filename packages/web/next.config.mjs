import createMDX from '@next/mdx'

import remarkGfm from 'remark-gfm'

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@iliazlobin/core'],
  images: {
    // unoptimized: true,
    domains: ['static.iliazlobin.com', 'static.dev.iliazlobin.com'],
  },
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
})

export default withMDX(nextConfig)
