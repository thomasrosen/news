import { MapCard } from "@/components/map/MapCard";
import { MarkerPoint } from "@/components/map/MarkerPoint";
import { Card } from "@/components/ui/card";
import imageLoader from '@/lib/image-loader';
import type { MDXComponents } from 'mdx/types';
import Image, { ImageProps } from 'next/image';

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including inline styles,
// components from other libraries, and more.

const components = {
  h2: ({ children }) => (
    <h2 className="text-2xl font-bold mt-8 my-2">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-bold mt-8 my-2">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="my-2">{children}</p>
  ),
  img: async (props) => {
    return <Image
      loader={imageLoader}
      className="w-full h-auto my-4"
      width={600}
      height={600}
      {...(props as ImageProps)}
    />
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
    <Card className="p-2">
      <pre className="whitespace-pre-wrap">{children}</pre>
    </Card>
  ),
  Map: async (props) => {
    return <MapCard {...props} />
  },
  Point: async (props) => {
    return <MarkerPoint {...props} />
  },
} satisfies MDXComponents

export function useMDXComponents(): MDXComponents {
  return components
}
