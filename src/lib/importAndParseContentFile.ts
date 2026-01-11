import { ContentMetadata } from "@/types/ContentMetadata";

export async function importAndParseContentFile({ slug, subpath }: { slug: string, subpath: string }): Promise<null | { ContentComponent: React.ElementType, metadata: ContentMetadata}> {
  try {
    const { title = '', metadata = {}, default: ContentComponent } = await import(`@@/content/${subpath}/${slug}.mdx`)

    return {
      ContentComponent,
      metadata: {
        publishedAt: metadata?.publishedAt || new Date().toISOString(),
        slug,
        title,
        description: metadata?.summary || '',
        coverphoto: metadata?.coverphoto || null,
      },
    }
  } catch (error) {
    console.error('ERROR_BSTBl2po', error);
    return null;
  }
}
