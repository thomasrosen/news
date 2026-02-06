import { Icon } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { possible_subpaths } from '@/constants';
import { addOpenGraphMetadataForArticle } from '@/lib/addOpenGraphMetadataForArticle';
import { fetchAndParseMxdFile } from '@/lib/fetchAndParseMxdFile';
import { formatDate } from '@/lib/formatDate';
import imageLoader from '@/lib/image-loader';
import { listFiles } from '@/lib/storage/listFiles';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export const dynamicParams = false // By marking dynamicParams as false, accessing a route not defined in generateStaticParams will 404.

export async function generateStaticParams() {
  const staticParams = []

  const extension = '.mdx' // Markdown files
  for (const subpath of possible_subpaths) {
    const files = await listFiles({ prefix: subpath })
    staticParams.push(...files.map((file) => ({ slug: [subpath, file.replace(extension, '')] })))
  }

  return staticParams
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const filepath = slug.join('/')

  if (filepath.endsWith('.mdx')) {
    const { metadata } = await fetchAndParseMxdFile({ filepath }) || {}

    if (!metadata) {
      return null
    }

    if (slug.includes('articles')) {
      return await addOpenGraphMetadataForArticle({ metadata })
    }

    return metadata
  }

  return null
}

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const filepath = slug.join('/')

  if (filepath.endsWith('.mdx')) {
    const mdx_file_content = await fetchAndParseMxdFile({ filepath })
    if (!mdx_file_content) {
      notFound()
    }

    const { content, metadata } = mdx_file_content

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
            // url: `${baseUrl}/${metadata.filepath}`,
            // author: {
            //   '@type': 'Person',
            //   name: metadata.author || 'Unknown Author',
            // },
          }),
        }}
      />

      <Link href="/" className="block mb-8">
        <Button variant="outline">
          <Icon name="arrow_back" size="sm" />
          back to startpage
        </Button>
      </Link>

      {
        metadata.coverphoto
          ? <div className="relative w-full h-auto aspect-square mb-8 shrink-0">
            <Image
              loading="eager"
              loader={imageLoader}
              alt=""
              src={metadata.coverphoto}
              width={600}
              height={600}
              className="object-cover w-full h-full"
            />
          </div>
          : null
      }

      <h1 className="title font-semibold text-2xl tracking-tighter">
        {metadata.title}
      </h1>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm">
        <p className="shrink-0 tabular-nums opacity-60 text-sm tracking-tight">
          {formatDate(metadata.publishedAt)}
        </p>
      </div>
      <article className="prose">
        <Suspense fallback="Loading…">
          {content}
        </Suspense>
      </article>
    </section>
  }

  if (filepath.endsWith('.png') || filepath.endsWith('.jpg') || filepath.endsWith('.jpeg')) {
    const url_path_to_raw = `/api/storage/raw/${filepath}`
      .replace(/\/{2,}/, '/')

    return <section>
      <Link href="/" className="block mb-8">
        <Button variant="outline">
          <Icon name="arrow_back" size="sm" />
          back to startpage
        </Button>
      </Link>

      <a className="block relative w-full h-auto mb-8 shrink-0" href={url_path_to_raw} target="_blank">
        <Image
          loading="eager"
          loader={imageLoader}
          alt=""
          src={filepath}
          width={600}
          height={600}
          className="w-full h-auto"
        />
      </a>

      <h1 className="title font-semibold text-2xl tracking-tighter">
        {filepath}
      </h1>
    </section>
  }

  notFound()
}
