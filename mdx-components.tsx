import type { MDXComponents } from 'mdx/types'
import Image, { ImageProps } from 'next/image'

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including inline styles,
// components from other libraries, and more.

const components = {
  // Allows customizing built-in components, e.g. to add styling.
  h1: ({ children }) => (
    <h1 className="text-red-500">{children}</h1>
  ),
  img: (props) => (
    <Image
      sizes="100vw"
      className="w-full h-auto my-4 rounded"
      {...(props as ImageProps)}
    />
  ),
  li: ({ children }) => (
    <li className="text-green-500">{children}</li>
  ),
  ul: ({ children }) => (
    <ul>{children}</ul>
  ),
  ol: ({ children }) => (
    <ol>{children}</ol>
  ),
} satisfies MDXComponents

export function useMDXComponents(): MDXComponents {
  return components
}
