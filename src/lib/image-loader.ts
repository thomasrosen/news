'use client'

const api_path = '/api/storage/images/'

export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  const params = new URLSearchParams({ w: width.toString() })
  if (quality) {
    params.set('q', quality.toString())
  }

  // Forward original path to your API route
  return `${src.startsWith(api_path) ? '' : api_path}${src}?${params.toString()}`
}
