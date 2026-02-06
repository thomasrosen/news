import { ReadStream } from "node:fs";
import { createReadStream as createReadStream_fs } from "./fs/createReadStream";

export function createReadStream(props: {
  filepath: string;
}): ReadStream {
  if (process.env.storage === 'fs') {
    return createReadStream_fs(props);
  }

  throw new Error(`Unsupported storage type: ${process.env.storage}`);
}

export type createReadStream_PropsType = Parameters<typeof createReadStream>[0]
export type createReadStream_ReturnType = ReturnType<typeof createReadStream>
