import fs from 'fs/promises';
import path from 'path';

export async function getContentFilenames(): Promise<string[]> {
  const folderPath = path.join(process.cwd(), 'content');
  const files = await fs.readdir(folderPath)
  const extension = '.mdx' // Markdown files
  return files
    .filter((file) => file.endsWith(extension))
}

export async function getAllArticles() {
  const files = await getContentFilenames()

  const articles = await Promise.all(
    files.map(async (filename) => {
      const slug = filename.replace('.mdx', '')

      return await importAndParseArticle({ slug })
    })
  )

  return articles
    .filter((article) => !!article) // only keep non-null array-entries
}

export async function getOneArticle({ slug }: {slug: string}) {
  const files = await getContentFilenames()

  if (!files.includes(`${slug}.mdx`)) {
    return
  }

  return importAndParseArticle({ slug })
}

async function importAndParseArticle({ slug }: {slug: string}) {
  try {
    const { title = '', metadata, default: ArticleComponent } = await import(`@@/content/${slug}.mdx`)

    const baseUrl = '' // website base url

    const publishedAt = metadata?.publishedAt || new Date().toISOString()
    const description = metadata?.summary || ''
    const coverphoto = metadata?.coverphoto || null

    const ogImage = coverphoto
      ? coverphoto
      : `${baseUrl}/og?title=${encodeURIComponent(title)}`

    return {
      ArticleComponent,
      metadata: {
        publishedAt,
        slug,
        title,
        description: metadata?.summary || '',
        openGraph: {
          title,
          description,
          type: 'article',
          publishedTime: publishedAt,
          url: `${baseUrl}/article/${slug}`,
          images: [
            {
              url: ogImage,
            },
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          images: [ogImage],
        },
      },
    }
  } catch (error) {
    console.error(`Error importing article with slug "${slug}":`, error);
    return null;
  }
}
