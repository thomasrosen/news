import { remarkExtractTitle } from '@/lib/remarkExtractTitle';
import { remarkPrefixImages } from '@/lib/remarkPrefixImages';
import createMDX from '@next/mdx';
import type { NextConfig } from "next";
import path from 'path';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeMdxImportMedia from 'rehype-mdx-import-media';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';

let nextConfig: NextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // Optionally, add any other Next.js config below
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    console.log('__dirname', __dirname)
    console.log('path.resolve(__dirname)', path.resolve(__dirname))

    // config.resolve.alias['@@'] = path.resolve('./'); // Maps @@ to project root
    // Or for your tsconfig paths:
    config.resolve.alias['@@'] = path.resolve(__dirname);
    return config;
  },
}

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [
      remarkGfm,
      [remarkFrontmatter, {type: 'yaml', marker: '-'}],
      [remarkMdxFrontmatter, { name: 'metadata' }],
      remarkExtractTitle,
      remarkPrefixImages,
    ],
    rehypePlugins: [
      [rehypeMdxImportMedia, { resolve: false }],
      [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer', 'nofollow'] }]
    ],
  },
})
// Merge MDX config with Next.js config
nextConfig = withMDX(nextConfig)

export default nextConfig
