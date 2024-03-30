import { retrieveItems } from '@iliazlobin/functions/blog/apify'
import { Item } from '@iliazlobin/functions/blog/types'

interface Event {
  resource?: {
    defaultDatasetId?: string
    exitCode?: number
  }
  url?: string
  title?: string
  text?: string
  date?: string
  [key: string]: any
}

interface Context {}

export async function handler(
  event: Event,
  context: Context,
): Promise<Item[]> {
  console.log(`[DEBUG] event: ${event}`)

  const datasetId = event.resource?.defaultDatasetId
  const exitCode = event.resource?.exitCode
  // console.log(`[DEBUG] datasetId: ${datasetId}`);
  // console.log(`[DEBUG] exitCode: ${exitCode}`);

  if (datasetId === undefined || exitCode !== 0) {
    return []
  }

  const items = await retrieveItems({ datasetId: datasetId })
  console.log(`[DEBUG] number of dataset items received: ${items.length}`)

  return items
}
