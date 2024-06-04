import { getPage, listPages } from '@iliazlobin/core/notion/storage/dynamodb'
import { downloadFromS3 } from '@iliazlobin/core/notion/storage/s3'
import { PageImage, Post } from '@iliazlobin/core/notion/types'

export async function retrievePost({
  pageId,
}: {
  pageId: string
}): Promise<Post> {
  const page = await getPage({ pageId })

  const contentMd = await downloadFromS3({
    bucketKey: page.contentMd.bucketKey,
  })
  if (!contentMd) {
    throw new Error('Download failed')
  }

  return {
    id: page.id,
    title: page.title,
    createdTime: page.createdTime,
    lastEditedTime: page.lastEditedTime,
    contentMd,
    images: page.images.map((image: PageImage) => ({
      url: image.url || '',
      width: image.width || 0,
      height: image.height || 0,
    })),
  }
}

export async function listPosts(): Promise<Post[]> {
  return await listPages()
}
