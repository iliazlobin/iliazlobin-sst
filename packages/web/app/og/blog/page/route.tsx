import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const { searchParams, host, protocol } = new URL(request.url)
    const slug = searchParams.get('slug')
    // const post = allPosts.find(post => post.slug === slug)
    // const title = post?.title || ''
    // const summary = post?.summary || ''
    const title = ''
    const summary = ''

    // const imageData = await fetch(
    //   new URL(
    //     '@/public/static/blog/langchain-on-step-functions/Cover.jpg',
    //     import.meta.url,
    //   ),
    // ).then(res => res.arrayBuffer())

    // const imagePath = post?.coverImage.path || ''
    // const localPath = `@/public${imagePath}`
    // const imageData = await fetch(new URL(localPath, import.meta.url)).then(
    //   res => res.arrayBuffer(),
    // )

    return new ImageResponse(
      (
        <div
          style={{
            backgroundColor: 'black',
            height: '100%',
            width: '100%',
            padding: 20,
            gap: 20,
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexDirection: 'column',
            flexWrap: 'nowrap',
          }}
        >
          <div
            style={{
              fontSize: 60,
              fontStyle: 'normal',
              color: 'white',
              margin: '0 0',
              padding: '60px 20px',
              lineHeight: 1.0,
              whiteSpace: 'pre-wrap',
              wordBreak: 'normal',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 30,
              fontStyle: 'italic',
              color: 'white',
              margin: 0,
              padding: '0 20px',
              lineHeight: 1.4,
              whiteSpace: 'pre-wrap',
              wordBreak: 'normal',
            }}
          >
            {summary}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        // debug: true,
      },
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
