import { getContentFilenames } from '@/lib/getContentFilenames';
import { importAndParseContentFile } from '@/lib/importAndParseContentFile';

export async function getOneContentFile({ slug, subpath }: { slug: string, subpath: string }) {
  const files = await getContentFilenames({ subpath })

  if (!files.includes(`${slug}.mdx`)) {
    return
  }

  return importAndParseContentFile({ slug, subpath })
}
