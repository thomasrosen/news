import { createReadStream_PropsType, createReadStream_ReturnType } from '@/lib/storage/createReadStream';
import fs from 'node:fs';
import path from 'path';

export function createReadStream({ filepath }: createReadStream_PropsType): createReadStream_ReturnType {
  const BASE_DIR = path.join(process.cwd(), process.env.content_path || '');
  const fullPath = path.join(process.cwd(), process.env.content_path || '', filepath);
  const resolved = path.resolve(fullPath);

  // Prevent directory traversal
  if (!resolved.startsWith(BASE_DIR)) {
    throw new Error('no directory traversal allowed');
  }

  return fs.createReadStream(resolved);
}
