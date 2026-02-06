import { getRawFileContentFromStorage as getRawFileContentFromStorage_fs } from "./fs/getRawFileContentFromStorage";

export function getRawFileContentFromStorage(props: {
  filepath: string;
  textOrBuffer: 'text' | 'buffer'
}): Promise<string | Buffer<ArrayBuffer>> {
  if (process.env.storage === 'fs') {
    return getRawFileContentFromStorage_fs(props);
  }

  throw new Error(`Unsupported storage type: ${process.env.storage}`);
}

export type getRawFileContentFromStorage_PropsType = Parameters<typeof getRawFileContentFromStorage>[0]
export type getRawFileContentFromStorage_ReturnType = ReturnType<typeof getRawFileContentFromStorage>
