import { getContentFilenames } from '@/lib/getContentFilenames';
import { importAndParseContentFile } from '@/lib/importAndParseContentFile';

export async function getAllContentFiles({ subpath }: { subpath: string }) {
  const files = await getContentFilenames({ subpath })

  const contentFiles = await Promise.all(
    files.map(async (filename) => {
      const slug = filename.replace('.mdx', '')

      const result = await importAndParseContentFile({ slug, subpath })
      if (!result) {
        return null
      }

      return result
    })
  )

  return contentFiles
    .filter((contentFile) => !!contentFile) // only keep non-null array-entries
}
