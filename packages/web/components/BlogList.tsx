import Image from 'next/image'

// import Link from '@/components/Link'
import Tag from '@/components/Tag'
import { siteConfig } from '@/config/site'

const MAX_DISPLAY = 5

const formatDate = (date: string, locale: string = 'en-US') => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  const now = new Date(date).toLocaleDateString(locale, options)
  return now
}

interface Props {
  tag?: string
  // posts: Post[]
}

const BlogList = ({ tag }: Props) => {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0 flex flex-col justify-between">
      {/* <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            {tag ? `Latest` : 'Latest'}
          </h1>
          {tag && (
            <p className="text-sm text-muted-foreground">
              Post tagged with <span className="italic">{tag}</span>.
              <Link href="/blog" className="ml-2">
                Show all posts
              </Link>
            </p>
          )}
        </div>
      </div>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {!posts.length && 'No posts found.'}
        {posts.slice(0, MAX_DISPLAY).map(post => {
          const { slug, date, title, summary, tags } = post
          return (
            <li key={slug} className="py-12">
              <article>
                <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                  <div className="flex flex-col">
                    <div className="mb-4">
                      <time dateTime={date}>
                        {formatDate(date, siteConfig.locale)}
                      </time>
                    </div>
                    <div>
                      {tags.map(tag => (
                        <div key={tag}>
                          <Tag text={tag} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-5 xl:col-span-3">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold leading-8 tracking-tight">
                          <Link
                            href={`/blog/page/${slug}`}
                            className="text-gray-900 dark:text-gray-100"
                          >
                            {title}
                          </Link>
                        </h2>
                        <div className="flex justify-center my-4">
                          <Link href={`/blog/page/${slug}`}>
                            <Image
                              src={post.coverImage.path}
                              alt={post.title}
                              width={post.coverImage.height}
                              height={post.coverImage.width}
                            />
                          </Link>{' '}
                        </div>
                      </div>
                      <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                        {summary}
                      </div>
                    </div>
                    <div className="text-base font-medium leading-6">
                      <Link
                        href={`/blog/page/${slug}`}
                        className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                        aria-label={`Read more: "${title}"`}
                      >
                        Read more &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            </li>
          )
        })}
      </ul> */}
    </div>
  )
}

export default BlogList
