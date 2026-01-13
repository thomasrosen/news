import path from "path"

export function getRootPath() {
  const currentDir = path.resolve(__dirname)
  if (currentDir.includes('/home/qiekub/news/')) {
    return '/home/qiekub/news'
  } else {
    return '@@'
  }
}
