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
      alt: string
      name: string
      ext: string
      width: number
      height: number
    }
  >()

  if (pageDetails.coverImageUrl) {
    const imageBuffer = await axios.get(pageDetails.coverImageUrl, {
      responseType: 'arraybuffer',
    })
    const coverImageSize = sizeOf(imageBuffer.data)

    const w = coverImageSize.width || 0
    const h = coverImageSize.height || 0
    const a = 'cover'
    const n = `cover-${w}x${h}`
    const e = 'png'

    const coverImageBucketKey = `${pageBucketKeyPrefix}/${n}.${e}`
    await uploadBufferToS3({
      bucketKey: coverImageBucketKey,
      buffer: imageBuffer.data,
    })
    const coverImageUrl = `https://${staticDomain}/${coverImageBucketKey}`

    imagesMap.set(a, {
      bucketKey: coverImageBucketKey,
      url: coverImageUrl,
      alt: a,
      name: n,
      ext: e,
      width: w,
      height: h,
    })
  }

  for (const { count, alt, url } of traverseImages({
    blocks: pageDetails.blocks,
    imagePrefix: 'image',
  })) {
    const imageBuffer = await axios.get(url, {
      responseType: 'arraybuffer',
    })
    const imageSize = sizeOf(imageBuffer.data)

    const w = imageSize.width || 0
    const h = imageSize.height || 0
    const a = `image${count}`
    const n = `image${count}-${w}x${h}`
    const e = 'png'

    const imageBucketKey = `${pageBucketKeyPrefix}/${n}.${e}`
    await uploadBufferToS3({
      bucketKey: imageBucketKey,
      buffer: imageBuffer.data,
    })
    const imageUrl = `https://${staticDomain}/${imageBucketKey}`

    imagesMap.set(a, {
      bucketKey: imageBucketKey,
      url: imageUrl,
      alt: a,
      name: n,
      ext: e,
      width: w,
      height: h,
    })
  }

  const markdownDocument = generateMarkdownFromPageBlocks({
    pageBlocks: pageDetails.blocks,
    urlRewriter: ({ count: imageCount }) => {
      const imageAlt = `image${imageCount}`
      // const width = imagesMap.get(imageAlt)?.width
      // const height = imagesMap.get(imageAlt)?.height
      const name = imagesMap.get(imageAlt)?.name
      const ext = imagesMap.get(imageAlt)?.ext
      const imageUrl = `https://${staticDomain}/pages/${pageDetails.id}/${name}.${ext}`
      return { imageAlt, imageUrl }
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
