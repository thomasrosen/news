import { listFiles as listFiles_fs } from "./fs/listFiles";

export function listFiles(props: {
  prefix: string;
  extensions?: string[];
}): Promise<string[]> {
  if (process.env.storage === 'fs') {
    return listFiles_fs(props);
  }

  throw new Error(`Unsupported storage type: ${process.env.storage}`);
}

export type listFiles_PropsType = Parameters<typeof listFiles>[0]
export type listFiles_ReturnType = ReturnType<typeof listFiles>
