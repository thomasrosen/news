// app/api/images/[...slug]/route.ts
import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

const BASE_DIR = path.join(process.cwd(), 'content', 'media');

function getContentType(ext: string) {
  switch (ext.toLowerCase()) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    case '.webp':
      return 'image/webp';
    default:
      return 'application/octet-stream';
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  // slug is an array from the catch-all route
  const { slug } = await params
  const relPath = slug.join('/');
  const filePath = path.join(BASE_DIR, relPath);

  // Prevent directory traversal
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(BASE_DIR)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  try {
    const file = await fs.readFile(resolved);
    const ext = path.extname(resolved);
    const contentType = getContentType(ext);

    return new NextResponse(file, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      return new NextResponse('Not found', { status: 404 });
    }
    return new NextResponse('Internal server error', { status: 500 });
  }
}
