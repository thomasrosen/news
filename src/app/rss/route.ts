import { baseUrl } from '@/constants';
import { getAllContentFiles } from '@/lib/getAllContentFiles';

export async function GET() {
  const allBlogs = await getAllContentFiles({ subpath: 'articles' })

  const itemsXml = allBlogs
    .sort((a, b) => {
      if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
        return -1
      }
      return 1
    })
    .map(
      (article) =>
        `<item>
          <title>${article.metadata.title}</title>
          <link>${baseUrl}/${article.metadata.filepath}</link>
          <description>${article.metadata.description || ''}</description>
          <pubDate>${new Date(
            article.metadata.publishedAt
          ).toUTCString()}</pubDate>
        </item>`
    )
    .join('\n')

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>RSS-Feed</title>
      <link>${baseUrl}</link>
      <description>RSS feed of the articles.</description>
      ${itemsXml}
    </channel>
  </rss>`

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'text/xml',
    },
  })
}
