import {
  generateMarkdownFromPageBlocks,
  getPageDetails,
  traverseImages,
} from './notion-client/client'
import { updatePage } from './storage/dynamodb'
import { uploadBufferToS3 } from './storage/s3'
import { Page } from './types'
import axios from 'axios'
import sizeOf from 'image-size'
import { Bucket } from 'sst/node/bucket'
import { Config } from 'sst/node/config'

const bucketName = Bucket.NotionBucket.bucketName
const staticDomain = Config.staticDomain

export async function exportMarkdownPage({ pageId }: { pageId: string }) {
  const pageDetails = await getPageDetails({ pageId })

  const pageBucketKeyPrefix = `pages/${pageDetails.id}`

  const imagesMap = new Map<
    string,
    {
      bucketKey: string
      url: string
      width: number
      height: number
    }
  >()

  if (pageDetails.coverImageUrl) {
    const imageBuffer = await axios.get(pageDetails.coverImageUrl, {
      responseType: 'arraybuffer',
    })
    const coverImageSize = sizeOf(imageBuffer.data)

    const coverImageBucketKey = `${pageBucketKeyPrefix}/cover.png`
    await uploadBufferToS3({
      bucketKey: coverImageBucketKey,
      buffer: imageBuffer.data,
    })

    const coverImageUrl = `https://${staticDomain}/${coverImageBucketKey}`

    imagesMap.set('cover', {
      bucketKey: coverImageBucketKey,
      url: coverImageUrl,
      width: coverImageSize.width || 0,
      height: coverImageSize.height || 0,
    })
  }

  for (const { name, url } of traverseImages({
    blocks: pageDetails.blocks,
    imagePrefix: 'image',
  })) {
    const imageBuffer = await axios.get(url, {
      responseType: 'arraybuffer',
    })
    const imageSize = sizeOf(imageBuffer.data)

    const imageBucketKey = `${pageBucketKeyPrefix}/${name}`
    await uploadBufferToS3({
      bucketKey: imageBucketKey,
      buffer: imageBuffer.data,
    })

    const imageUrl = `https://${staticDomain}/${imageBucketKey}`

    imagesMap.set(name, {
      bucketKey: imageBucketKey,
      url: imageUrl,
      width: imageSize.width || 0,
      height: imageSize.height || 0,
    })
  }

  const markdownDocument = generateMarkdownFromPageBlocks({
    pageBlocks: pageDetails.blocks,
    urlRewriter: ({ imageCount }) => {
      const imageName = `image${imageCount.toString()}.png`
      const imageUrl = `https://${staticDomain}/pages/${pageDetails.id}/${imageName}`
      return imageUrl
    },
  })

  const pageMarkdownBucketKey = `${pageBucketKeyPrefix}/page.md`
  await uploadBufferToS3({
    bucketKey: pageMarkdownBucketKey,
    buffer: Buffer.from(markdownDocument),
  })

  const pageMarkdownUrl = `https://${staticDomain}/${pageMarkdownBucketKey}`

  const cleanTitle = pageDetails.title.replace(/^\[.*\] /, '')

  const page: Page = {
    id: pageDetails.id,
    title: cleanTitle,
    images: Array.from(imagesMap).map(
      ([name, { bucketKey, url, width, height }]) => ({
        name,
        bucketKey,
        url,
        width,
        height,
      }),
    ),
    contentMd: {
      url: pageMarkdownUrl,
      bucketKey: pageMarkdownBucketKey,
    },
    createdTime: pageDetails.createdTime,
    lastEditedTime: pageDetails.lastEditedTime,
    bucket: bucketName,
  }

  await updatePage({ page })
}
