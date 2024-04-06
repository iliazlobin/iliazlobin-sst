import { ActorInfo, Item } from './types'
import { Actor, ApifyClient, Dataset } from 'apify'
import { Config } from 'sst/node/config'

const apifyClient = new ApifyClient({
  token: Config.apifyToken,
})

export async function retrieveItemsWithoutText({
  datasetId,
}: {
  datasetId: string
}): Promise<Item[]> {
  const dataset = new Dataset({ id: datasetId, client: apifyClient }) // Fix: Pass dataset ID and client as an object
  const datasetItems = await dataset.getData()

  return datasetItems.items.map((item: any) => ({
    authors: item.authors,
    author: item.author,
    blog: item.blog,
    categories: item.categories,
    date: item.date,
    tags: item.tags,
    tag: item.tag,
    title: item.title,
    url: item.url,
  }))
}

export async function retrieveItemWithText({
  datasetId,
  url,
}: {
  datasetId: string
  url: string
}): Promise<Item> {
  const dataset = new Dataset({ id: datasetId, client: apifyClient }) // Fix: Pass dataset ID and client as an object
  const datasetItems = await dataset.getData()
  const item = datasetItems.items.find((item: any) => item.url === url)
  if (!item) {
    throw new Error(`Item not found`)
  }
  return {
    authors: item.authors,
    blog: item.blog,
    categories: item.categories,
    date: item.date,
    tags: item.tags,
    title: item.title,
    url: item.url,
    text: item.text,
  }
}

export async function getActorInfo({
  actorId: actorId,
}: {
  actorId: string
}): Promise<ActorInfo> {
  const actor = await apifyClient.actor(actorId).get()

  if (!actor) {
    throw new Error(`Actor not found`)
  }

  return actor
}
