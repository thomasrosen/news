import { listFiles_PropsType, listFiles_ReturnType } from '@/lib/storage/listFiles';
import fs from 'fs';
import path from 'path';

export async function listFiles({ prefix, extensions = ['.mdx', '.png', '.jpg', '.jpeg'] }: listFiles_PropsType): listFiles_ReturnType {
  const BASE_DIR = path.join(process.cwd(), process.env.content_path || '');
  const folderPath = path.join(process.cwd(), process.env.content_path || '', prefix);
  const resolved = path.resolve(folderPath);

  // Prevent directory traversal
  if (!resolved.startsWith(BASE_DIR)) {
    throw new Error('no directory traversal allowed');
  }

  const files = fs.readdirSync(folderPath)
  if (extensions.length === 0) {
    return files
  }

  return files.filter((file) => extensions.some(ext => file.endsWith(ext)))
}
