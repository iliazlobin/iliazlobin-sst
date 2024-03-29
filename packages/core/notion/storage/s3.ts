import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'

import { Bucket } from 'sst/node/bucket'

const bucketName = Bucket.NotionBucket.bucketName

const client = new S3Client({})

export interface LogType {
  [key: string | symbol]: Date | string
}

export async function uploadBufferToS3({
  bucketKey,
  buffer,
}: {
  bucketKey: string
  buffer: ArrayBuffer
}) {
  const bufferLength = buffer.byteLength
  console.debug(`Uploading ${bufferLength} bytes to ${bucketName}/${bucketKey}`)

  const buf = Buffer.from(buffer)

  const result = await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: bucketKey,
      Body: buf,
    }),
  )

  if (result.$metadata.httpStatusCode !== 200) {
    throw new Error(`Failed to upload to ${bucketName}/${bucketKey}`)
  }
}

export async function downloadFromS3({ bucketKey }: { bucketKey: string }) {
  console.debug(`Downloading from ${bucketName}/${bucketKey}`)

  const result = await client.send(
    new GetObjectCommand({
      Bucket: bucketName,
      Key: bucketKey,
    }),
  )

  if (result.$metadata.httpStatusCode !== 200) {
    throw new Error(`Failed to download from ${bucketName}/${bucketKey}`)
  }

  return result.Body?.transformToString()
}
