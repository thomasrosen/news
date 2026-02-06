import { getRawFileContentFromStorage_PropsType, getRawFileContentFromStorage_ReturnType } from '@/lib/storage/getRawFileContentFromStorage';
import fs from 'node:fs/promises';
import path from 'path';

export async function getRawFileContentFromStorage({ filepath, textOrBuffer }: getRawFileContentFromStorage_PropsType): getRawFileContentFromStorage_ReturnType {
  const BASE_DIR = path.join(process.cwd(), process.env.content_path || '');
  const fullPath = path.join(process.cwd(), process.env.content_path || '', filepath);

  const resolved = path.resolve(fullPath);

  // Prevent directory traversal
  if (!resolved.startsWith(BASE_DIR)) {
    throw new Error('no directory traversal allowed');
  }

  const data = textOrBuffer === 'text'
    ? await fs.readFile(resolved, 'utf-8')
    : await fs.readFile(resolved)

  return data
}
