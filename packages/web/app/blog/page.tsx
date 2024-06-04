import BlogList from '@iliazlobin/web/components/BlogList'
import { getWebPosts } from '@iliazlobin/web/service/post'
import '@iliazlobin/web/styles/mdx.css'

export default async function PostsPage() {
  const posts = await getWebPosts()

  return <BlogList posts={posts} />
}
