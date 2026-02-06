import { getFileSize } from '@/lib/storage/getFileSize';
import { getFileType_PropsType, getFileType_ReturnType } from '@/lib/storage/getFileType';
import { fileTypeFromBuffer } from 'file-type';
import fsp from 'node:fs/promises';
import path from 'path';

const SNIFF_BYTES = 4100;
const TEXT_MIME_TYPES: Record<string, string> = {
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.mdx': 'text/markdown; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};


export async function getFileType({ filepath }: getFileType_PropsType): getFileType_ReturnType {
  const BASE_DIR = path.join(process.cwd(), process.env.content_path || '');
  const fullPath = path.join(process.cwd(), process.env.content_path || '', filepath);
  const resolved = path.resolve(fullPath);

  // Prevent directory traversal
  if (!resolved.startsWith(BASE_DIR)) {
    throw new Error('no directory traversal allowed');
  }

  // detect the content type
  const ext = path.extname(resolved).toLowerCase();
  let contentType = TEXT_MIME_TYPES[ext];
  if (!contentType) {
    const fileSize = await getFileSize({ filepath });

    const fh = await fsp.open(resolved, 'r');
    const buffer = Buffer.alloc(
      Math.min(SNIFF_BYTES, fileSize)
    );
    await fh.read(buffer, 0, buffer.length, 0);
    await fh.close();

    const detected = await fileTypeFromBuffer(buffer);
    contentType = detected?.mime ?? 'application/octet-stream';
  }

  return contentType
}
