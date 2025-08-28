import Link from 'next/link'

import presentations from '@iliazlobin/web/content/presentations.json'
import '@iliazlobin/web/styles/mdx.css'

export default async function PresentationsPage() {
  for (const p of presentations) {
    const { title, summary, date, blogPost, googleSlidesUrl } = p
    console.log(title)
  }

  return (
    <>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0 flex flex-col justify-between">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {presentations.map(p => {
            const {
              title,
              summary,
              date,
              blogPost,
              googleSlidesUrl,
              youtubeUrl,
            } = p
            return (
              <div className="space-y-2 pb-8 pt-6 md:space-y-4" key={title}>
                <h2 className="font-heading mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                  {title}
                </h2>
                <div className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400 mb-4">
                  <time dateTime={date}>
                    {new Date(date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
                {blogPost && (
                  <Link
                    href={blogPost}
                    className="text-blue-500 hover:underline text-base font-medium leading-6"
                  >
                    Blog post
                  </Link>
                )}
                <p className="leading-7 [&:not(:first-child)]:mt-6">
                  {summary}
                </p>
                {googleSlidesUrl && (
                  <iframe
                    src={googleSlidesUrl}
                    className="w-full aspect-video space-y-2"
                    allowFullScreen={true}
                  ></iframe>
                )}
                {youtubeUrl && (
                  <iframe
                    className="w-full aspect-video space-y-2"
                    src={youtubeUrl}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
