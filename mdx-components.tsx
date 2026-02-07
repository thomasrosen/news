import { MapCard } from "@/components/map/MapCard";
import { MarkerPoint } from "@/components/map/MarkerPoint";
import { EnhancedLink, EnhancedLinkButton } from "@/components/server/EnhancedLink";
import { Card } from "@/components/ui/card";
import imageLoader from '@/lib/image-loader';
import { cn } from "@/lib/utils";
import type { MDXComponents } from 'mdx/types';
import Image, { ImageProps } from 'next/image';
import Link from "next/link";

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including inline styles,
// components from other libraries, and more.

export const components = {
  h2: ({ children }) => (
    <h2 className="text-2xl font-bold mt-6 my-3">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-bold mt-6 my-3">{children}</h3>
  ),
  p: (props) => (
    <div {...props} role="paragraph" className="my-3" />
  ),
  img: (props) => {
    return <Image
      loader={imageLoader}
      className="w-full h-auto my-4"
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
    //     className="w-full h-auto my-4"
    //     width={600}
    //     height={600}
    //     {...(props as ImageProps)}
    //   />
    // </a>
  },
  a: async (props) => {
    return <EnhancedLink {...props} />
  },
  Button: (props) => {
    return <EnhancedLinkButton {...props} />
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
  Map: (props) => {
    return <MapCard {...props} />
  },
  Point: (props) => {
    return <MarkerPoint {...props} />
  },
  Box: ({ children, wide = false, ...props }) => {
    return <div {...props} role="group" className={cn('relative py-2 px-6 -mx-6 my-6', wide === false && 'bg-secondary')}>
      {wide === true ? <div className="absolute inset-0 left-1/2 w-screen -translate-x-1/2 -z-1 bg-secondary" /> : null}
      {children}
    </div>
  },
} satisfies MDXComponents

export function useMDXComponents(): MDXComponents {
  return components
}
