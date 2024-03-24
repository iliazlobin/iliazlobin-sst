export type Page = {
  id: string
  title: string
  bucket: string
  images: {
    name: string
    bucketKey: string
    url?: string
    width?: number
    height?: number
  }[]
  contentMd: { bucketKey: string; url?: string }
  createdTime: string
  lastEditedTime: string
}

export type PostHeader = {
  id: string
  title: string
  createdTime: string
  lastEditedTime: string
}

export type Post = PostHeader & {
  contentMd: string
  images: { name: string; url: string; width: number; height: number }[]
}
