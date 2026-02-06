import { createReadStream } from '@/lib/storage/createReadStream';
import { getFileSize } from '@/lib/storage/getFileSize';
import { getFileType } from '@/lib/storage/getFileType';
import { NextResponse } from 'next/server';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const filepath = slug.join('/');

  try {
    const fileSize = await getFileSize({ filepath });
    const contentType = await getFileType({ filepath });

    // stream the file to the client
    const nodeStream = createReadStream({ filepath });
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
        'Content-Length': String(fileSize),
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
