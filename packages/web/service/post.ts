import { WebPost } from '@/domain/post'

import { listPosts } from '@iliazlobin/core/service/notion'

export async function getWebPosts(): Promise<WebPost[]> {
  const posts = await listPosts()
  const webPosts = posts.map(post => ({
    ...post,
    slug: post.title.toLowerCase().replace(/ /g, '-'),
    date: new Date(post.createdTime).toISOString(),
    summary: 'TODO: summary',
    tags: ['TODO'],
  }))
  return posts
}
