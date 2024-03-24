import { Post } from '@iliazlobin/core/domain/post'

export type WebPost = Post & {
  slug: string
  date: string
  summary: string
  tags: string[]
}
