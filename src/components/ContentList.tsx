import { formatDate } from '@/lib/formatDate'
import { getAllContentFiles } from '@/lib/getAllContentFiles'
import imageLoader from '@/lib/image-loader'
import Image from 'next/image'
import Link from 'next/link'

export async function ContentList({ subpath }: { subpath: string }) {
  const allArticles = await getAllContentFiles({ subpath })

  return (
    <div className="flex flex-col gap-4">
      {allArticles
        .sort((a, b) => {
          if (
            new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ) {
            return -1
          }
          return 1
        })
        .map((article) => {
          return <Link
            key={article.metadata.slug}
            className="flex flex-col space-y-0"
            href={`/${subpath}/${article.metadata.slug}`}
          >
            <span className="shrink-0 tabular-nums">
              {formatDate(article.metadata.publishedAt, false)}
            </span>
            <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
              {
                article.metadata.coverphotoImported || article.metadata.coverphoto
                  ? <div className="relative w-16 h-16 my-1 shrink-0">
                    <Image
                      loader={imageLoader}
                      alt=""
                      src={article.metadata.coverphotoImported || article.metadata.coverphoto}
                      width={64}
                      height={64}
                      className="object-cover w-16 h-16"
                    />
                  </div>
                  : null
              }
              <p className="flex flex-col gap-0 tracking-tight">
                <strong>{article.metadata.title || 'Untitled'}</strong>
                {article.metadata.description || null}
              </p>
            </div>
          </Link>

        })}
    </div>
  )
}
