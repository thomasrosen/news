import { fileTypeFromBuffer } from 'file-type';
import { NextResponse } from 'next/server';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

const BASE_DIR = path.join(process.cwd(), 'content');
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

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const resolved = path.resolve(
    path.join(BASE_DIR, slug.join('/'))
  );

  if (!resolved.startsWith(BASE_DIR)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  try {
    // get the content length
    const stat = await fsp.stat(resolved);
    if (!stat.isFile()) {
      return new NextResponse('Not found', { status: 404 });
    }

    // detect the content type
    const ext = path.extname(resolved).toLowerCase();
    let contentType = TEXT_MIME_TYPES[ext];
    if (!contentType) {
      const fh = await fsp.open(resolved, 'r');
      const buffer = Buffer.alloc(
        Math.min(SNIFF_BYTES, stat.size)
      );
      await fh.read(buffer, 0, buffer.length, 0);
      await fh.close();

      const detected = await fileTypeFromBuffer(buffer);
      contentType = detected?.mime ?? 'application/octet-stream';
    }

    // stream the file to the client
    const nodeStream = fs.createReadStream(resolved);
    const webStream = new ReadableStream({
      start(controller) {
        nodeStream.on('data', chunk => controller.enqueue(chunk));
        nodeStream.on('end', () => controller.close());
        nodeStream.on('error', err => controller.error(err));
      },
      cancel() {
        nodeStream.destroy();
      },
    });

    // send the response
    return new NextResponse(webStream, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': stat.size.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return new NextResponse('Not found', { status: 404 });
    }
    console.error(error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
