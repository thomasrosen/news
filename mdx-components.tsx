import { Icon } from "@/components/Icon";
import { MapCard } from "@/components/map/MapCard";
import { MarkerPoint } from "@/components/map/MarkerPoint";
import { Card } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { fetchAndParseMxdFile } from "@/lib/fetchAndParseMxdFile";
import imageLoader from '@/lib/image-loader';
import { cn } from "@/lib/utils";
import type { MDXComponents } from 'mdx/types';
import Image, { ImageProps } from 'next/image';
import { Suspense } from "react";

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including inline styles,
// components from other libraries, and more.

export const components = {
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
    const { src } = props
    const raw_src_file_path = src.replace('/api/storage/images/', '/api/storage/raw/')
    const url_path_to_raw = raw_src_file_path.replace(/\/{2,}/, '/')

    return <a href={url_path_to_raw} target="_blank">
      <Image
        loader={imageLoader}
        className="w-full h-auto my-4"
        width={600}
        height={600}
        {...(props as ImageProps)}
      />
    </a>
  },
  a: async ({ children, href }) => {
      if (href.startsWith('/people/') && href.endsWith('.mdx')) {
        const linkData = await fetchAndParseMxdFile({ filepath: href })
        if (linkData) {
          return <HoverCard openDelay={100} closeDelay={200}>
            <HoverCardTrigger asChild>
              <a
                href={href}
                className={cn('transition-colors decoration-primary/60 hover:decoration-primary underline underline-offset-2 decoration-2 group')}
              >
                {
                  linkData.metadata.coverphoto
                    ? <span className="inline-block align-text-bottom mx-1 relative w-4 h-4 shrink-0">
                      <Image
                        loader={imageLoader}
                        alt=""
                        src={linkData.metadata.coverphoto}
                        width={16}
                        height={16}
                        className="object-cover w-full h-full rounded-full"
                      />
                    </span>
                    : null
                }
                {linkData.metadata.title}
              </a>
            </HoverCardTrigger>
            <HoverCardContent side="top" align="center" className="flex w-64 flex-col gap-0.5">
              {
                linkData.metadata.coverphoto
                  ? <span className="inline-block align-text-bottom mb-2 relative w-16 h-16 shrink-0">
                    <Image
                      loader={imageLoader}
                      alt=""
                      src={linkData.metadata.coverphoto}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full rounded-full"
                    />
                  </span>
                  : null
              }
              <div className="font-semibold">{linkData.metadata.title}</div>
              <div>{linkData.metadata.description}</div>
              <div className="text-muted-foreground mt-1 text-xs">
                {href}
              </div>
            </HoverCardContent>
          </HoverCard>
        }
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
    return <Suspense><MapCard {...props} /></Suspense>
  },
  Point: async (props) => {
    return <MarkerPoint {...props} />
  },
} satisfies MDXComponents

export function useMDXComponents(): MDXComponents {
  return components
}
