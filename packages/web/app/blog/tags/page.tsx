import Link from '@/components/Link'
import Tag from '@/components/Tag'
import '@/styles/mdx.css'

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

export default async function TagsPage() {
  // const tagKeys = allPosts.reduce((keys: string[], post) => {
  //   post.tags.forEach(tag => {
  //     if (!keys.includes(tag)) {
  //       keys.push(tag)
  //     }
  //   })
  //   return keys
  // }, [])
  // const tagCounts = tagKeys.reduce((counts: { [key: string]: number }, tag) => {
  //   counts[tag] = (counts[tag] || 0) + 1
  //   return counts
  // }, {})
  // const sortedTags = tagKeys.sort((a, b) => a.localeCompare(b))

  return (
    <div className="flex flex-col items-start justify-start divide-y divide-gray-200 dark:divide-gray-700 md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0">
      <div className="space-x-2 pb-8 pt-6 md:space-y-5">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:border-r-2 md:px-6 md:text-6xl md:leading-14">
          Tags
        </h1>
      </div>
      <div className="flex max-w-lg flex-wrap">
        {/* {tagKeys.length === 0 && 'No tags found.'}
        {sortedTags.map(t => {
          return (
            <div key={t} className="mb-2 mr-5 mt-2">
              <Tag text={t} />
              <Link
                href={`/blog/tags/${t}`}
                className="-ml-2 text-sm font-semibold uppercase text-gray-600 dark:text-gray-300"
                aria-label={`View posts tagged ${t}`}
              >
                {` (${tagCounts[t]})`}
              </Link>
            </div>
          )
        })} */}
      </div>
    </div>
  )
}
