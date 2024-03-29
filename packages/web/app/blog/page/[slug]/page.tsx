import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'

import Tag from '@iliazlobin/web/components/Tag'
import BlogPost from '@iliazlobin/web/components/blog-post-mdx'
import { DashboardTableOfContents } from '@iliazlobin/web/components/toc'
import TocButton from '@iliazlobin/web/components/toc-button'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@iliazlobin/web/components/ui/avatar'
import { Button } from '@iliazlobin/web/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@iliazlobin/web/components/ui/card'
import { siteConfig } from '@iliazlobin/web/config/site'
import { getTableOfContents } from '@iliazlobin/web/lib/toc'
import { getWebPosts, retrieveWebPost } from '@iliazlobin/web/service/post'
import '@iliazlobin/web/styles/mdx.css'

interface Params {
  slug: string
}

interface Props {
  params: Params
  // searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const posts = await getWebPosts()
  const post = posts.find(post => post.slug === params.slug)

  if (!post) {
    notFound()
  }

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      url: `${siteConfig.url}/blog/page/${post.slug}`,
      // images: ['https://ui.shadcn.com/og.jpg'],
      images: [
        {
          url: `/og/blog/page?slug=${post.slug}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: [
        {
          url: `/og/blog/page?slug=${post.slug}`,
          width: 1200,
          height: 630,
        },
      ],
      creator: '@iliazlobin',
    },
  }
}

export async function generateStaticParams(): Promise<Params[]> {
  const posts = await getWebPosts()
  console.debug('[DEBUG] length of posts:', posts.length)
  const params = posts.map(post => ({ slug: post.slug }))
  return params
}

export default async function BlogPage({ params }: Props) {
  let post
  try {
    post = await retrieveWebPost({ slug: params.slug })
  } catch (error) {
    console.error('Error retrieving web post:', error)
    notFound()
  }

  const content = post.contentMd
  const toc = await getTableOfContents(content)

  return (
    <main className="container grid lg:grid-cols-[320px_auto] xl:grid-cols-[320px_auto_280px] gap-4 p-0">
      <div className="hidden lg:block shrink-0 p-4">
        <div className="sticky top-20 ">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Authors</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="flex items-center justify-between space-x-4">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatars/02.png" alt="Image" />
                      <AvatarFallback>IZ</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">
                        Ilia Zlobin
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Cloud Architect
                      </p>
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
          {post.tags.length > 0 && (
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                {post.tags.map(tag => (
                  <div key={tag}>
                    <Tag text={tag} />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <div className="mx-auto lg:mx-0 w-full min-w-0 max-w-3xl p-4">
        <h1 className={'text-6xl font-bold text-center'}>{post.title}</h1>
        {post.createdTime && (
          <div className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400 text-center mb-4">
            <time dateTime={post.createdTime}>
              {new Date(post.createdTime).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
        )}
        <div className="flex justify-center mb-4">
          {post.coverImage && (
            <Image
              src={post.coverImage.url}
              alt={post.title}
              width={post.coverImage.height}
              height={post.coverImage.width}
            />
          )}
        </div>
        <BlogPost source={content} />
      </div>
      <div className="hidden xl:block shrink-0 p-4">
        <div className="sticky top-20 text-sm">
          <Card className="mb-4">
            <CardContent className="grid">
              <TocButton></TocButton>
              <DashboardTableOfContents toc={toc} />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
