import { Icon } from "@/components/Icon";
import { MapCard } from "@/components/map/MapCard";
import { MarkerPoint } from "@/components/map/MarkerPoint";
import { Card } from "@/components/ui/card";
import imageLoader from '@/lib/image-loader';
import { cn } from "@/lib/utils";
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
  a: ({ children, href }) => {

      console.log('link node:', href)
      if (href.startsWith('people/')) {
        const [subpath, slug] = href.split('/')
        console.log('would fetch link data for:', { subpath, slug })
        // const linkData = await getOneContentFile({ slug, subpath })
        // node.linkData = linkData
        //   // node.url = `@@/content/media/${node.url}`
        //   node.url = `/api/images/${node.url}`
      }

    return <a
      href={href}
      className={cn('transition-colors decoration-primary/60 hover:decoration-primary underline underline-offset-2 decoration-2 group')}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer nofollow' : undefined}
    >
      {children}
      {href.startsWith('http') ? <Icon name="arrow_outward" size="sm" className="transition-colors align-middle text-primary/60 group-hover:text-primary" /> : null}
    </a>
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
