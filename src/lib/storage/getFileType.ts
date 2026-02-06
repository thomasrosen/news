import { getFileType as getFileType_fs } from "./fs/getFileType";

export function getFileType(props: {
  filepath: string;
}): Promise<string> {
  if (process.env.storage === 'fs') {
    return getFileType_fs(props);
  }

  throw new Error(`Unsupported storage type: ${process.env.storage}`);
}

export type getFileType_PropsType = Parameters<typeof getFileType>[0]
export type getFileType_ReturnType = ReturnType<typeof getFileType>
