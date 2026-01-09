import { formatDate } from '@/lib/formatDate'
import { getAllArticles } from '@/lib/getArticles'
import Link from 'next/link'

export async function ArticleList() {
  const allArticles = await getAllArticles()

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
            className="flex flex-col space-y-1"
            href={`/article/${article.metadata.slug}`}
          >
            <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
              <p className="shrink-0 text-neutral-600 dark:text-neutral-400 w-[100px] tabular-nums">
                {formatDate(article.metadata.publishedAt, false)}
              </p>
              <p className="flex flex-col gap-0 text-neutral-900 dark:text-neutral-100 tracking-tight">
                <strong>{article.metadata.title || 'Untitled'}</strong>
                {article.metadata.description || null}
              </p>
            </div>
          </Link>

        })}
    </div>
  )
}
