import {
  getActorInfo,
  retrieveItemWithText,
  retrieveItemsWithoutText,
} from '@iliazlobin/functions/blog/apify'
import { Item } from '@iliazlobin/functions/blog/types'

interface Context {}
interface Event {
  datasetId: string
  url: string
}

export async function handler(event: Event, context: Context): Promise<Item> {
  console.log(`[DEBUG] event: ${event}`)

  const item = await retrieveItemWithText({
    datasetId: event.datasetId,
    url: event.url,
  })
  const jsonString = JSON.stringify(item)
  const jsonStringSizeInBytes = Buffer.byteLength(jsonString, 'utf8')
  console.log(`[DEBUG] Item size retrieved: ${jsonStringSizeInBytes / 1024} KB`)

  return item
}
