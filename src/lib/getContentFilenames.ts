import fs from 'fs';
import path from 'path';

export function getContentFilenames({ subpath = 'articles' }: { subpath: string }): string[] {
  const folderPath = path.join(process.cwd(), 'content', subpath);
  const files = fs.readdirSync(folderPath)
  const extension = ['.mdx', '.png', '.jpg', '.jpeg']
  return files.filter((file) => extension.some(extension => file.endsWith(extension)))
}
