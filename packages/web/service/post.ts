import { listPosts, retrievePost } from '@iliazlobin/core/notion/service'
import { Post } from '@iliazlobin/core/notion/types'

import { slug } from 'github-slugger'

export type WebPost = Post & {
  slug: string
  summary: string
  tags: string[]
}

export async function getWebPosts(): Promise<WebPost[]> {
  const posts = await listPosts()
  console.debug(`[DEBUG] getWebPosts: length of posts: ${posts.length}`)
  const webPosts = posts.map(post => ({
    ...post,
    slug: slug(post.title),
    summary: '',
    tags: [],
    contentMd: '',
    images: [],
  }))
  return webPosts
}

export async function retrieveWebPost({
  slug,
}: {
  slug: string
}): Promise<WebPost> {
  const posts = await getWebPosts()
  // console.debug(
  //   `[DEBUG] retrieveWebPost: length of posts: ${posts.length}, slug: ${slug}`,
  // )
  // posts.forEach(post => {
  //   console.debug(`[DEBUG] post.slug: ${post.slug}, slug: ${slug}`)
  //   if (post.slug === slug) {
  //     console.debug(`[DEBUG] post.title: ${post.title}`)
  //   }
  // })
  const webPost = posts.find(post => post.slug === slug)
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
