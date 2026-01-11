import { baseUrl } from '@/constants';
import { ContentMetadata } from '@/types/ContentMetadata';

export function addOpenGraphMetadataForArticle({ metadata }: { metadata: ContentMetadata }) {
  try {
    const ogImage = metadata?.coverphoto
      ? metadata?.coverphoto
      : `${baseUrl}/og?title=${encodeURIComponent(metadata?.title)}`

    return {
      ...metadata,
      openGraph: {
        title: metadata?.title,
        description: metadata?.description,
        type: 'article',
        publishedTime: metadata?.publishedAt,
        url: `${baseUrl}/article/${metadata?.slug}`,
        images: [
          {
            url: ogImage,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: metadata?.title,
        description: metadata?.description,
        images: [ogImage],
      },
    }
  } catch (error) {
    console.error('ERROR_bnvnfqVF', error);
    return {};
  }
}
