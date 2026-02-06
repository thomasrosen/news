import { fetchAndParseMxdFile } from '@/lib/fetchAndParseMxdFile';
import { getContentFilenames } from '@/lib/getContentFilenames';

export async function getAllContentFiles({ subpath }: { subpath: string }) {
  const files = getContentFilenames({ subpath })

  const contentFiles = await Promise.all(
    files.map(async (filename) => {
      const filepath = `${subpath}/${filename}`

      if (filename.endsWith('.mdx')) {
        return await fetchAndParseMxdFile({ filepath })
      }

      return {
      content: null,
      metadata: {
        filepath,
        publishedAt: null,
        title: filepath,
        description: '',
        coverphoto: ['.png', '.jpg', '.jpeg'].some((ext) => filepath.endsWith(ext))
          ? `/api/storage/images/${filepath}`
            .replace(/\/{2,}/g, '/') // replace multiple slashes with a single slash
          : '',
      },
    }
    })
  )

  return contentFiles
    .filter((contentFile) => !!contentFile) // only keep non-null array-entries
}
