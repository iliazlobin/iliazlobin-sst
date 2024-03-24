import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'

import Tag from '@/components/Tag'
// import MyButton from '@/components/mybutton'
import { DashboardTableOfContents } from '@/components/toc'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { siteConfig } from '@/config/site'
// import {
//   DynamoDBClient,
//   GetItemCommand,
//   PutItemCommand,
// } from '@aws-sdk/client-dynamodb'
// import { listPages } from '@iliazlobin/storage/notion/dynamodb'
import { getTableOfContents } from '@/lib/toc'
import '@/styles/mdx.css'

// import { listPages } from '@iliazlobin/storage/notion/dynamodb'
// import { Table } from 'sst/node/table'

// export interface Params {
//   slug: string[]
// }

interface Props {
  params: {
    slug: string[]
  }
  // searchParams: { [key: string]: string | string[] | undefined }
}

async function getPostFromParams({ params }: Props) {
  const slug = params.slug?.join('/') || ''
  // const slug = params.slug
  // const post = allPosts.find(post => post.slug === slug)
  // const post = new Post({ slug: slug })
  return null

  // if (!post) {
  //   return null
  // }

  // return post
}

// export async function generateImageMetadata() {
//   return [
//     <>
//       <div
//         style={{
//           fontSize: 128,
//           background: 'white',
//           width: '100%',
//           height: '100%',
//           display: 'flex',
//           textAlign: 'center',
//           alignItems: 'center',
//           justifyContent: 'center',
//         }}
//       >
//         Hello world!
//       </div>
//     </>,
//   ]
// }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // const post = await getPostFromParams({ params })
  // if (!post) {
  //   return {}
  // }

  const post = {
    title: 'title',
    summary: 'summary',
    slug: 'slug',
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
      creator: '@shadcn',
    },
  }
}

// property og:site_name Notion
// property og:type website
// property og:url https://www.notion.so
// property og:title Notion – The all-in-one workspace for your notes, tasks, wikis, and databases.
// property og:description A new tool that blends your everyday work apps into one. It's the all-in-one workspace for you and your team
// property og:image https://www.notion.so/images/meta/default.png
// property og:locale en_US

// export async function generateMetadata(
//   { params, searchParams }: Props,
//   parent: ResolvingMetadata
// ): Promise<Metadata> {
//   // read route params
//   const id = params.id

//   // fetch data
//   const product = await fetch(`https://.../${id}`).then((res) => res.json())

//   // optionally access and extend (rather than replace) parent metadata
//   const previousImages = (await parent).openGraph?.images || []

//   return {
//     title: product.title,
//     openGraph: {
//       images: ['/some-specific-page-image.jpg', ...previousImages],
//     },
//   }
// }

// export async function generateStaticParams(): Promise<Props['params'][]> {
//   return allPosts.map(post => ({
//     slug: post.slug.split('/'),
//     // slug: post.slug,
//   }))
// }

export default async function BlogPage({ params }: Props) {
  // const post = await getPostFromParams({ params })
  // if (!post) {
  //   notFound()
  // }

  // const tags = post.tags
  // const toc = await getTableOfContents(post.body.raw)

  // const client = new DynamoDBClient({})

  // const input = {
  //   Item: {
  //     pageId: {
  //       S: '5d488cacdf6d411295dcb93f0d4080ec',
  //     },
  //     pageTitle: {
  //       S: '[TEST] LangChain on AWS Step Functions…',
  //     },
  //     // createdTime: {
  //     //   S: page.createdTime,
  //     // },
  //     // lastEditedTime: {
  //     //   S: page.lastEditedTime,
  //     // },
  //     // coverImageUrl: {
  //     //   S: page.coverImageUrl,
  //     // },
  //     pageMarkdownUrl: {
  //       S: 'url',
  //     },
  //   },
  //   TableName: 'dev-iliazlobin-ApiStack-NotionPagesTable',
  // }

  // const command = new PutItemCommand(input)
  // const response = await client.send(command)

  // if (response.$metadata.httpStatusCode !== 200) {
  //   throw new Error(`Failed to update page`)
  // }

  // const input = {
  //   TableName: 'dev-iliazlobin-ApiStack-NotionPagesTable',
  //   Key: {
  //     pageId: { S: '5d488cacdf6d411295dcb93f0d4080ec' },
  //     pageTitle: { S: '[TEST] LangChain on AWS Step Functions…' },
  //   },
  // }

  // const command = new GetItemCommand(input)

  // const response = await client.send(command)

  // if (response.$metadata.httpStatusCode !== 200) {
  //   throw new Error(`Failed to get page`)
  // }

  // console.log(response.Item)

  // const tableName = Table.NotionPagesTable.tableName
  // console.log(tableName)

  // const pages = await listPages()
  // const slug = params.slug?.join('/') || ''
  // const page = pages.find((page: Page) => page.id === slug)

  // if (page === undefined || page.pageMarkdownUrl === undefined) {
  //   notFound()
  // }

  // const response = await fetch(page.pageMarkdownUrl)
  // const pageMd = await response.text()

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
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              {/* {tags.map(tag => (
                <div key={tag}>
                  <Tag text={tag} />
                </div>
              ))} */}
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="mx-auto lg:mx-0 w-full min-w-0 max-w-3xl p-4">
        {/* <h1 className={'text-6xl font-bold text-center'}>{post.title}</h1> */}
        {/* {post.date && (
          <div className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400 text-center mb-4">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
        )} */}
        <div className="flex justify-center mb-4">
          {/* <Image
            src={post.coverImage.path}
            alt={post.title}
            width={post.coverImage.height}
            height={post.coverImage.width}
          /> */}
        </div>

        {/* <Mdx code={post.body.code} /> */}
      </div>
      <div className="hidden xl:block shrink-0 p-4">
        <div className="sticky top-20 text-sm">
          <Card className="mb-4">
            {/* <CardHeader>
              <CardTitle className="text-xl">Table of Content</CardTitle>
            </CardHeader> */}
            <CardContent className="grid">
              {/* <MyButton></MyButton> */}
              {/* <DashboardTableOfContents toc={toc} /> */}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
