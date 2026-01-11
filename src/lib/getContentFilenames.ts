import fs from 'fs/promises';
import path from 'path';

export async function getContentFilenames({ subpath = 'articles' }: { subpath: string }): Promise<string[]> {
  const folderPath = path.join(process.cwd(), 'content', subpath);
  const files = await fs.readdir(folderPath)
  const extension = '.mdx' // Markdown files
  return files
    .filter((file) => file.endsWith(extension))
}
