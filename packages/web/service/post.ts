import { listPosts, retrievePost } from '@iliazlobin/core/notion/service'
import { Post } from '@iliazlobin/core/notion/types'

export type WebPost = Post & {
  slug: string
  summary: string
  tags: string[]
}

export async function getWebPosts(): Promise<WebPost[]> {
  const posts = await listPosts()
  const webPosts = posts.map(post => ({
    ...post,
    slug: post.title.toLowerCase().replace(/ /g, '-'),
    summary: '',
    tags: [],
    contentMd: '', // Add the missing property
    images: [], // Add the missing property
  }))
  return webPosts
}

export async function retrieveWebPost({
  slug,
}: {
  slug: string
}): Promise<WebPost> {
  const webPosts = await getWebPosts()
  const webPost = webPosts.find(post => post.slug === slug)
  if (!webPost) {
    throw new Error('Post not found')
  }

  const post = await retrievePost({ pageId: webPost.id })
  return {
    ...webPost,
    contentMd: post.contentMd,
    images: post.images,
  }
}
