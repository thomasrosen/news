import { fetchAndParseMxdFile } from '@/lib/fetchAndParseMxdFile';
import { getContentFilenames } from '@/lib/getContentFilenames';

export async function getAllContentFiles({ subpath }: { subpath: string }) {
  const files = getContentFilenames({ subpath })

  const contentFiles = await Promise.all(
    files.map(async (filename) => await fetchAndParseMxdFile({ filepath: `${subpath}/${filename}` }))
  )

  return contentFiles
    .filter((contentFile) => !!contentFile) // only keep non-null array-entries
}
