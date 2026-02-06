import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

/*

ffmpeg -hide_banner -i bbb_sunflower_2160p_60fps_normal.mp4 \
-filter_complex \
"[0:v]split=4[v1440][v1080][v720][v480]; \
[v1440]scale='min(2560,iw)':'min(1440,ih)'[v0]; \
[v1080]scale='min(1920,iw)':'min(1080,ih)'[v1]; \
[v720] scale='min(1280,iw)':'min(720,ih)' [v2]; \
[v480] scale='min(854,iw)':'min(480,ih)'  [v3]" \
-map "[v0]" -map "[v1]" -map "[v2]" -map "[v3]" \
-map 0:a:0 -map 0:a:0 -map 0:a:0 -map 0:a:0 \
-c:v libx264 -preset ultrafast -profile:v high \
-b:v:0 9M   -bufsize:v:0 18M \
-b:v:1 6M   -bufsize:v:1 12M \
-b:v:2 3M   -bufsize:v:2 6M  \
-b:v:3 1500k -bufsize:v:3 3M \
-x264opts keyint=120:min-keyint=120:scenecut=0 \
-c:a aac -b:a 96k -ac 2 \
-f hls \
-hls_time 2 \
-hls_playlist_type vod \
-hls_flags independent_segments \
-var_stream_map \
"v:0,a:0 v:1,a:1 v:2,a:2 v:3,a:3" \
-master_pl_name master.m3u8 \
-hls_segment_filename 'vs%v/file_%03d.ts' \
vs%v/out.m3u8

*/

const BASE_DIR = path.join(process.cwd(), 'content');
const CACHE_DIR = path.join(process.cwd(), 'cache', 'videos');
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







/*
app.get("/video", function (req, res) {
  // Ensure there is a range given for the video
  const range = req.headers.range;
  if (!range) {
    return res.status(400).send("Requires Range header");
  }

  // get video stats (about 61MB)
  const videoPath = "bigbuck.mp4";
  const videoSize = fs.statSync("bigbuck.mp4").size;

  // Parse Range
  // Example: "bytes=32324-"
  const CHUNK_SIZE = 10 ** 6; // 1MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  // Create headers
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  // HTTP Status 206 for Partial Content
  res.writeHead(206, headers);

  // create video read stream for this particular chunk
  const videoStream = fs.createReadStream(videoPath, { start, end });

  // Stream the video chunk to the client
  videoStream.pipe(res);
})
*/
