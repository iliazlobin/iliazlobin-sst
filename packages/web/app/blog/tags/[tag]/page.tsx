import BlogList from '@/components/BlogList'
import '@/styles/mdx.css'

interface TagPageProps {
  params: {
    tag: string
  }
}

// export async function generateStaticParams(): Promise<
//   TagPageProps['params'][]
// > {
//   const uniqueTags = allPosts.reduce((tags, post) => {
//     post.tags.forEach(tag => tags.add(tag))
//     return tags
//   }, new Set<string>())

//   return Array.from(uniqueTags).map(tag => ({
//     tag,
//   }))
// }

export default function PostsPage({ params }: TagPageProps) {
  const tag = params.tag
  // const sortedPosts = allPosts.sort(
  //   (a, b) => Number(new Date(b.date)) - Number(new Date(a.date)),
  // )
  // const filteredPosts = tag
  //   ? allPosts.filter(post => post.tags.includes(tag))
  //   : allPosts
  // const posts = allPosts

  // return <BlogList tag={tag} posts={posts} />
}
