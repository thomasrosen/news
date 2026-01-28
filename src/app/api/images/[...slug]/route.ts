// app/api/images/[...slug]/route.ts
import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const BASE_DIR = path.join(process.cwd(), 'content', 'media');
const CACHE_DIR = path.join(process.cwd(), 'cache');
const CACHE_REVALIDATION_KEY = '2026-01-28'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const url = new URL(req.url);
  const relPath = slug.join('/');
  const filePath = path.join(BASE_DIR, relPath);
  const resolved = path.resolve(filePath);

  // Prevent directory traversal
  if (!resolved.startsWith(BASE_DIR)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const w = parseInt(url.searchParams.get('w') || '0');
  const q = parseInt(url.searchParams.get('q') || '80');
  const cacheKey = `${CACHE_REVALIDATION_KEY}-${relPath}-${w}x${q}.webp`; // Cache filename (always JPEG output)
  const cachePath = path.join(CACHE_DIR, cacheKey);
  const cacheResolved = path.resolve(cachePath);

  // Check cache first
  try {
    await fs.access(cacheResolved);
    const cachedBuffer = await fs.readFile(cacheResolved);
    return new NextResponse(cachedBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Vary': 'w,q',
      },
    });
  } catch {
    // Cache miss
  }

  // Read original, resize, cache, and serve
  try {
    const originalBuffer = await fs.readFile(resolved);
    const size = w > 0 ? w : undefined
    const processor = sharp(originalBuffer)
      .rotate() // Auto-orient based on EXIF
      .resize(size, size, { withoutEnlargement: true, fit: 'inside' })
      // .jpeg({ quality: Math.min(Math.max(q, 1), 100) });
      .webp({ 
        quality: Math.min(Math.max(q, 1), 100),
        effort: 4  // 0-6, balance between speed/size (default 4)
      });

    const resizedBuffer = await processor.toBuffer();

    // Ensure cache dir exists
    await fs.mkdir(CACHE_DIR, { recursive: true });
    await fs.writeFile(cacheResolved, resizedBuffer);

    return new NextResponse(new Uint8Array(resizedBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Vary': 'w,q',
      },
    });
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      return new NextResponse('Not found', { status: 404 });
    }
    console.error(err);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
