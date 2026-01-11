import { baseUrl } from '@/constants';
import { getAllContentFiles } from '@/lib/getAllContentFiles';

export default async function sitemap() {
  let articles = (await getAllContentFiles({ subpath: 'articles' }))
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
