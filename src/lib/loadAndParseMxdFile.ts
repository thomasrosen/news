
import { getRawFileContentFromStorage } from "@/lib/storage/getRawFileContentFromStorage";
import { ContentMetadata } from "@/types/ContentMetadata";
import { components } from "@@/mdx-components";
import { mdxOptions } from "@@/next.config";
import { evaluate } from "next-mdx-remote-client/rsc";
import { JSX } from "react";

export async function loadAndParseMxdFile({ filepath }: { filepath: string }): Promise<null | { content: JSX.Element, metadata: ContentMetadata}> {
  try {
    const source = await getRawFileContentFromStorage({ filepath, textOrBuffer: 'text' })

    // import { baseUrl } from "@/constants";
    // const res = await fetch(`${baseUrl}/api/storage/raw/${filepath}`)
    // if (!res.ok) {
    //   console.error(`Failed to fetch content file: ${res.status} ${res.statusText}`)
    //   return null
    // }
    // const source = await res.text()

    const eval_res = await evaluate({
      source,
      options: { mdxOptions: {
        format: "mdx",
        remarkPlugins: mdxOptions?.remarkPlugins as any,
        rehypePlugins: mdxOptions?.rehypePlugins as any,
        recmaPlugins: mdxOptions?.recmaPlugins as any,
      }},
      components,
    });
    const { content, mod, error } = eval_res
    const { title = '', metadata = {} } = (mod || {}) as any
    if (error) {
      throw error
    }

    const coverphoto = metadata?.coverphoto || null

    return {
      content,
      metadata: {
        filepath,
        publishedAt: metadata?.publishedAt || new Date().toISOString(),
        title,
        description: metadata?.summary || '',
        coverphoto: coverphoto
          ? `/api/storage/images/${coverphoto}`
            .replace(/\/{2,}/g, '/') // replace multiple slashes with a single slash
          : '',
      },
    }
  } catch (error) {
    console.error('ERROR_BSTBl2po', error);
    return null;
  }
}
