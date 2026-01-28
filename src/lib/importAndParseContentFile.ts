import { ContentMetadata } from "@/types/ContentMetadata";
// import { StaticImageData } from "next/image";

export async function importAndParseContentFile({ slug, subpath }: { slug: string, subpath: string }): Promise<null | { ContentComponent: React.ElementType, metadata: ContentMetadata}> {
  try {
    const { title = '', metadata = {}, default: ContentComponent } = await import(`@@/content/${subpath}/${slug}.mdx`)

    const coverphoto = metadata?.coverphoto || null
    // let coverphotoResolved: StaticImageData | null = null
    // if (coverphoto) {
    //   const { default: coverphotoResolvedTmp } = await import(`@@/content/media/${coverphoto}`)
    //   coverphotoResolved = coverphotoResolvedTmp
    // }

    return {
      ContentComponent,
      metadata: {
        publishedAt: metadata?.publishedAt || new Date().toISOString(),
        slug,
        title,
        description: metadata?.summary || '',
        coverphoto: `/api/images/${coverphoto}`,
        coverphotoImported: null, // coverphotoResolved,
      },
    }
  } catch (error) {
    console.error('ERROR_BSTBl2po', error);
    return null;
  }
}
