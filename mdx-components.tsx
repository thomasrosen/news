import { Box } from "@/components/Box";
import { MapCard } from "@/components/map/MapCard";
import { MarkerPoint } from "@/components/map/MarkerPoint";
import { EnhancedLink, EnhancedLinkButton } from "@/components/server/EnhancedLink";
import { Card } from "@/components/ui/card";
import imageLoader from '@/lib/image-loader';
import { cn } from "@/lib/utils";
import type { MDXComponents } from 'mdx/types';
import Image, { ImageProps } from 'next/image';
import Link from "next/link";
import { Suspense } from "react";

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including inline styles,
// components from other libraries, and more.

export const components = {
  h2: ({ children }) => (
    <h2 className="text-2xl font-bold mt-6">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-bold mt-6">{children}</h3>
  ),
  p: (props) => (
    <div {...props} role="paragraph" />
  ),
  img: (props) => {
    return <Image
      loader={imageLoader}
      className="w-full h-auto object-cover"
      width={600}
      height={600}
      {...(props as ImageProps)}
    />

    // const { src } = props
    // const raw_src_file_path = src.replace('/api/storage/images/', '/api/storage/raw/')
    // const url_path_to_raw = raw_src_file_path.replace(/\/{2,}/, '/')
    //
    // return <a href={url_path_to_raw} target="_blank">
    //   <Image
    //     loader={imageLoader}
    //     className="w-full h-auto"
    //     width={600}
    //     height={600}
    //     {...(props as ImageProps)}
    //   />
    // </a>
  },
  a: (props) => {
    return <Suspense><EnhancedLink {...props} /></Suspense>
  },
  Button: (props) => {
    return <Suspense><EnhancedLinkButton {...props} /></Suspense>
  },
  Link: ({ className, ...props }) => {
    return <Link {...props} className={cn('transition-opacity hover:opacity-90', className)} />
  },
  li: ({ children }) => (
    <li>{children}</li>
  ),
  ul: ({ children }) => (
    <ul>{children}</ul>
  ),
  ol: ({ children }) => (
    <ol>{children}</ol>
  ),
  pre: ({ children }) => (
    <Card className="p-3">
      <pre className="whitespace-pre-wrap">{children}</pre>
    </Card>
  ),
  Map: async (props) => {
    return <Suspense><MapCard {...props} /></Suspense>
  },
  Point: async (props) => {
    return <Suspense><MarkerPoint {...props} /></Suspense>
  },
  Box: (props) => {
    return <Box {...props} />
  },
} satisfies MDXComponents

export function useMDXComponents(): MDXComponents {
  return components
}
