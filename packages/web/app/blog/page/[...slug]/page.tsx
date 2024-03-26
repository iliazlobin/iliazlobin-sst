import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'

import Tag from '@/components/Tag'
import { CodeBlockWrapper } from '@/components/code-block-wrapper'
import { CopyButton, CopyNpmCommandButton } from '@/components/copy-button'
import { StyleWrapper } from '@/components/style-wrapper'
import { Style } from '@/components/styles'
import { DashboardTableOfContents } from '@/components/toc'
import TocButton from '@/components/toc-button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { siteConfig } from '@/config/site'
import { Event } from '@/lib/events'
import { getTableOfContents } from '@/lib/toc'
import { cn } from '@/lib/utils'
import { getWebPosts, retrieveWebPost } from '@/service/post'
import '@/styles/mdx.css'
import { NpmCommands } from '@/types/unist'

import { MDXRemote } from 'next-mdx-remote/rsc'
import { Suspense } from 'react'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { visit } from 'unist-util-visit'

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
// import { listPages } from '@iliazlobin/storage/notion/dynamodb'
// import { Table } from 'sst/node/table'

// export interface Params {
//   slug: string[]

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
  const posts = await getWebPosts()
  const post = posts.find(post => post.slug === params.slug.join('/'))

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
      creator: '@shadcn',
    },
  }
}

export const components = {
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className={cn(
        'font-heading mt-2 scroll-m-20 text-4xl font-bold',
        className,
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={cn(
        'font-heading mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0',
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className={cn(
        'font-heading mt-8 scroll-m-20 text-xl font-semibold tracking-tight',
        className,
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className={cn(
        'font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight',
        className,
      )}
      {...props}
    />
  ),
  h5: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5
      className={cn(
        'mt-8 scroll-m-20 text-lg font-semibold tracking-tight',
        className,
      )}
      {...props}
    />
  ),
  h6: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h6
      className={cn(
        'mt-8 scroll-m-20 text-base font-semibold tracking-tight',
        className,
      )}
      {...props}
    />
  ),
  a: ({ className, ...props }: React.HTMLAttributes<HTMLAnchorElement>) => (
    <a
      className={cn('font-medium underline underline-offset-4', className)}
      {...props}
    />
  ),
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={cn('leading-7 [&:not(:first-child)]:mt-6', className)}
      {...props}
    />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={cn('my-6 ml-6 list-disc', className)} {...props} />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className={cn('my-6 ml-6 list-decimal', className)} {...props} />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <li className={cn('mt-2', className)} {...props} />
  ),
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <blockquote
      className={cn('mt-6 border-l-2 pl-6 italic', className)}
      {...props}
    />
  ),
  img: ({
    className,
    alt,
    src,
    width,
    height,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    if (width && height) {
      return (
        <Image
          src={src || ''}
          alt={alt || ''}
          width={Number(width)}
          height={Number(height)}
        />
      )
    }
    return (
      <img
        className={cn('rounded-md', className)}
        src={src}
        alt={alt}
        {...props}
      />
    )
  },
  hr: ({ ...props }: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="my-4 md:my-8" {...props} />
  ),
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className={cn('w-full', className)} {...props} />
    </div>
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr
      className={cn('m-0 border-t p-0 even:bg-muted', className)}
      {...props}
    />
  ),
  th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={cn(
        'border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right',
        className,
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={cn(
        'border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right',
        className,
      )}
      {...props}
    />
  ),
  pre: ({
    className,
    __rawString__,
    __npmCommand__,
    __yarnCommand__,
    __pnpmCommand__,
    __bunCommand__,
    __withMeta__,
    __src__,
    __event__,
    __style__,
    ...props
  }: React.HTMLAttributes<HTMLPreElement> & {
    __style__?: Style['name']
    __rawString__?: string
    __withMeta__?: boolean
    __src__?: string
    __event__?: Event['name']
  } & NpmCommands) => {
    return (
      <StyleWrapper styleName={__style__}>
        <pre
          className={cn(
            'mb-4 mt-6 max-h-[650px] overflow-x-auto rounded-lg border bg-zinc-950 py-4 dark:bg-zinc-900',
            className,
          )}
          {...props}
        />
        {__rawString__ && !__npmCommand__ && (
          <CopyButton
            value={__rawString__}
            src={__src__}
            event={__event__}
            className={cn('absolute right-4 top-4', __withMeta__ && 'top-16')}
          />
        )}
        {__npmCommand__ &&
          __yarnCommand__ &&
          __pnpmCommand__ &&
          __bunCommand__ && (
            <CopyNpmCommandButton
              commands={{
                __npmCommand__,
                __yarnCommand__,
                __pnpmCommand__,
                __bunCommand__,
              }}
              className={cn('absolute right-4 top-4', __withMeta__ && 'top-16')}
            />
          )}
      </StyleWrapper>
    )
  },
  code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code
      className={cn(
        'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm',
        className,
      )}
      {...props}
    />
  ),
  Image,
  CodeBlockWrapper: ({ ...props }) => (
    <CodeBlockWrapper className="rounded-md border" {...props} />
  ),
  Step: ({ className, ...props }: React.ComponentProps<'h3'>) => (
    <h3
      className={cn(
        'font-heading mt-8 scroll-m-20 text-xl font-semibold tracking-tight',
        className,
      )}
      {...props}
    />
  ),
  Steps: ({ ...props }) => (
    <div
      className="[&>h3]:step steps mb-12 ml-4 border-l pl-8 [counter-reset:step]"
      {...props}
    />
  ),
}

export default async function BlogPage({ params }: Props) {
  const slug = params.slug.join('/')
  const post = await retrieveWebPost({ slug })

  if (!post) {
    notFound()
  }

  const contentMd = post.contentMd || ''
  // const mdxObject = await compile(contentMd, { remarkPlugins: [remarkGfm] })

  const options = {
    parseFrontmatter: false,
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        () => (tree: any) => {
          visit(tree, node => {
            if (node?.type === 'element' && node?.tagName === 'img') {
              // const alt = node?.properties?.alt
              const allMatch = node?.properties?.src.match(
                /.*\/([^-]+?)-(\d+?)x(\d+?)\.(\w+?)$/,
              )
              if (allMatch) {
                const name = allMatch[1]
                const width = allMatch[2]
                const height = allMatch[3]
                const ext = allMatch[4]
                if (!name || !width || !height || !ext) {
                  return
                }
                node.properties = {
                  ...node.properties,
                  name,
                  width,
                  height,
                  ext,
                }
                console.debug('DEBUG')
              }
            }
          })
        },
      ],
    },
  }

  const toc = await getTableOfContents(contentMd)
  console.debug('DEBUG')

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
        <MDXRemote
          source={contentMd}
          options={options}
          components={components}
        />
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
