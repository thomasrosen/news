import { getFileSize as getFileSize_fs } from "./fs/getFileSize";

export function getFileSize(props: {
  filepath: string;
}): Promise<number> {
  if (process.env.storage === 'fs') {
    return getFileSize_fs(props);
  }

  throw new Error(`Unsupported storage type: ${process.env.storage}`);
}

export type getFileSize_PropsType = Parameters<typeof getFileSize>[0]
export type getFileSize_ReturnType = ReturnType<typeof getFileSize>
