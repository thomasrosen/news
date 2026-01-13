import { StaticImageData } from "next/image"

export type ContentMetadata = {
  title: string
  description: string
  coverphoto: string
  coverphotoImported: StaticImageData | null
  publishedAt: string
  slug: string
}
