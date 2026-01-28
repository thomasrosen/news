import { getContentFilenames } from '@/lib/getContentFilenames';
import { importAndParseContentFile } from '@/lib/importAndParseContentFile';

export async function getOneContentFile({ slug, subpath }: { slug: string, subpath: string }) {
  const files = getContentFilenames({ subpath })

  if (!files.includes(`${slug}.mdx`)) {
    return
  }

  return await importAndParseContentFile({ slug, subpath })
}
