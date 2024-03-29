import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  ScanCommand,
} from '@aws-sdk/client-dynamodb'

import { Page, Post } from '../types'
import { Bucket } from 'sst/node/bucket'
import { Table } from 'sst/node/table'

const client = new DynamoDBClient({})
const tableName = Table.NotionPages.tableName
const bucketName = Bucket.NotionBucket.bucketName

export async function updatePage({ page }: { page: Page }): Promise<void> {
  const input = {
    Item: {
      pageId: { S: page.id },
      pageTitle: { S: page.title },
      images: {
        L: page.images.map(image => ({
          M: {
            name: { S: image.name },
            bucketKey: { S: image.bucketKey },
            url: { S: image.url || '' },
            width: { N: image.width?.toString() || '0' },
            height: { N: image.height?.toString() || '0' },
          },
        })),
      },
      contentMd: {
        M: {
          bucketKey: { S: page.contentMd.bucketKey },
          url: { S: page.contentMd.url || '' },
        },
      },
      createdTime: { S: page.createdTime },
      lastEditedTime: { S: page.lastEditedTime },
    },
    TableName: tableName,
  }

  const command = new PutItemCommand(input)
  const response = await client.send(command)

  if (response.$metadata.httpStatusCode !== 200) {
    throw new Error(`Bad status code`)
  }
}

export async function getPage({ pageId }: { pageId: string }): Promise<Page> {
  const input = {
    TableName: tableName,
    Key: {
      pageId: { S: pageId },
    },
  }

  const command = new GetItemCommand(input)
  const response = await client.send(command)

  if (response.$metadata.httpStatusCode !== 200) {
    throw new Error(`Bad status code`)
  }

  // validate Page object deeply
  const item = response.Item
  if (
    !item?.pageId?.S ||
    !item?.pageTitle?.S ||
    !item?.images?.L ||
    !item?.contentMd?.M ||
    !item?.createdTime?.S ||
    !item?.lastEditedTime?.S
  ) {
    throw new Error(`Validation failed`)
  }

  const images = item.images.L?.map(image => {
    if (!image?.M?.name?.S || !image?.M?.bucketKey?.S) {
      throw new Error(`Validation failed`)
    }

    return {
      name: image.M.name.S,
      bucketKey: image.M.bucketKey.S,
      url: image.M.url?.S,
      width: parseInt(image.M.width?.N || '0'),
      height: parseInt(image.M.height?.N || '0'),
    }
  })

  if (!item?.contentMd?.M?.bucketKey?.S) {
    throw new Error(`Validation failed`)
  }

  const contentMd = {
    bucketKey: item.contentMd.M.bucketKey.S,
    url: item?.contentMd?.M?.url?.S,
  }

  const page: Page = {
    id: item.pageId.S,
    title: item.pageTitle.S,
    images,
    contentMd: contentMd,
    createdTime: item.createdTime.S,
    lastEditedTime: item.lastEditedTime.S,
    bucket: bucketName,
  }

  return page
}

export async function listPages(): Promise<Post[]> {
  const input = {
    // ExpressionAttributeNames: {
    //   '#AT': 'AlbumTitle',
    //   '#ST': 'SongTitle',
    // },
    // ExpressionAttributeValues: {
    //   ':a': {
    //     S: 'No One You Know',
    //   },
    // },
    // FilterExpression: 'Artist = :a',
    // ProjectionExpression: '#ST, #AT',
    TableName: tableName,
  }
  const command = new ScanCommand(input)
  const response = await client.send(command)

  if (response.$metadata.httpStatusCode !== 200) {
    throw new Error(`Bad status code`)
  }

  const items = response.Items
  if (!items?.length) {
    return []
  }

  if (
    !items.every(item => {
      return (
        item?.pageId?.S &&
        item?.pageTitle?.S &&
        item?.createdTime?.S &&
        item?.lastEditedTime?.S
      )
    })
  ) {
    throw new Error(`Validation failed`)
  }

  return items.map(item => {
    const coverImage = item.images?.L?.filter(
      image => image?.M?.name?.S == 'cover',
    )?.[0]?.M

    return {
      id: item?.pageId?.S || '',
      title: item?.pageTitle?.S || '',
      createdTime: item?.createdTime?.S || '',
      lastEditedTime: item?.lastEditedTime?.S || '',
      contentMd: '',
      coverImage: {
        url: coverImage?.url?.S || '',
        width: parseInt(coverImage?.width?.N || '0'),
        height: parseInt(coverImage?.height?.N || '0'),
      },
    }
  })
}
