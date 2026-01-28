import { possible_subpaths } from '@/constants';
import { addOpenGraphMetadataForArticle } from '@/lib/addOpenGraphMetadataForArticle';
import { formatDate } from '@/lib/formatDate';
import { getContentFilenames } from '@/lib/getContentFilenames';
import { getOneContentFile } from '@/lib/getOneContentFile';
import imageLoader from '@/lib/image-loader';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export const dynamicParams = false // By marking dynamicParams as false, accessing a route not defined in generateStaticParams will 404.

export async function generateStaticParams() {
  const staticParams = []

  const extension = '.mdx' // Markdown files
  for (const subpath of possible_subpaths) {
    const files = await getContentFilenames({ subpath })
    staticParams.push(...files.map((file) => ({ subpath, slug: file.replace(extension, '') })))
  }

  return staticParams
}

export async function generateMetadata({ params }: { params: Promise<{ subpath: string, slug: string }> }) {
  const { slug, subpath } = await params
  const { metadata } = await getOneContentFile({ slug, subpath }) || {}

  if (!metadata) {
    return null
  }

  if (subpath === 'articles') {
    return await addOpenGraphMetadataForArticle({ metadata })
  }

  return metadata
}

export default async function Page({ params }: { params: Promise<{ subpath: string, slug: string }> }) {
  const { slug, subpath } = await params

  const article = await getOneContentFile({ slug, subpath })
  if (!article) {
    notFound()
  }

  const { ContentComponent, metadata } = article

  return <section>
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: metadata.title,
          datePublished: metadata.publishedAt,
          dateModified: metadata.publishedAt,
          description: metadata.description,
          // image: metadata.coverphoto,
          // url: `${baseUrl}/articles/${metadata.slug}`,
          // author: {
          //   '@type': 'Person',
          //   name: metadata.author || 'Unknown Author',
          // },
        }),
      }}
    />

    {
      metadata.coverphotoImported || metadata.coverphoto
        ? <Image
          loader={imageLoader}
          alt=""
          src={metadata.coverphotoImported || metadata.coverphoto}
          className="w-full h-auto my-4"
          width={600}
          height={600}
        />
        : null
    }

    <h1 className="title font-semibold text-2xl tracking-tighter">
      {metadata.title}
    </h1>
    <div className="flex justify-between items-center mt-2 mb-8 text-sm">
      <p className="text-sm">
        {formatDate(metadata.publishedAt)}
      </p>
    </div>
    <article className="prose">
      <ContentComponent />
    </article>
  </section>
}
