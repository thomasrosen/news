import { getAllArticles } from '@/lib/getArticles'

export const baseUrl = 'https://portfolio-blog-starter.vercel.app'

export default async function sitemap() {
  let articles = (await getAllArticles())
  .map((article) => ({
    url: `${baseUrl}/article/${article.metadata.slug}`,
    lastModified: article.metadata.publishedAt,
  }))

  let routes = ['', '/article'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...articles]
}
