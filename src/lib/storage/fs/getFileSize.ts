import fsp from 'node:fs/promises';
import path from 'path';
import { getFileSize_PropsType, getFileSize_ReturnType } from '../getFileSize';

export async function getFileSize({ filepath }: getFileSize_PropsType): getFileSize_ReturnType {
  const BASE_DIR = path.join(process.cwd(), process.env.content_path || '');
  const fullPath = path.join(process.cwd(), process.env.content_path || '', filepath);
  const resolved = path.resolve(fullPath);

  // Prevent directory traversal
  if (!resolved.startsWith(BASE_DIR)) {
    throw new Error('no directory traversal allowed');
  }

  // get the content length
  const stat = await fsp.stat(resolved);
  if (!stat.isFile()) {
    throw new Error('file not found');
  }

  return stat.size
}
