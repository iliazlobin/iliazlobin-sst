import BlogList from '@/components/BlogList'
import { getWebPosts } from '@/service/post'
import '@/styles/mdx.css'

export default async function PostsPage() {
  const posts = await getWebPosts()

  return <BlogList posts={posts} />
}
