import { getActorInfo, retrieveItemsWithoutText } from '@iliazlobin/functions/blog/apify'
import { Item } from '@iliazlobin/functions/blog/types'

interface Event {
  eventData: {
    actorId: string
    actorRunId: string
  }
  resource: {
    actId: string
    defaultDatasetId: string
    exitCode: number
  }
  url: string
  title: string
  text: string
  date: string
  // [key: string]: any
}

interface Context {}

export async function handler(event: Event, context: Context): Promise<Item[]> {
  console.log('[DEBUG] event: ', event)

  const datasetId = event.resource?.defaultDatasetId
  const exitCode = event.resource?.exitCode
  console.log(`[DEBUG] datasetId: ${datasetId}`);
  console.log(`[DEBUG] exitCode: ${exitCode}`);

  if (datasetId === undefined || exitCode !== 0) {
    return []
  }

  const items = await retrieveItemsWithoutText({ datasetId: datasetId })
  console.log(`[DEBUG] number of dataset items received: ${items.length}`)

  const actorInfo = await getActorInfo({ actorId: event.eventData.actorId })

  const cloud = extractCloudDifferentiator(actorInfo.name)
  const augmentedItems = items.map(item => ({
    ...item,
    cloud,
    datasetId,
  }))

  const jsonString = JSON.stringify(augmentedItems)
  const sizeInKb = jsonString.length / 1024
  console.log(`Result payload size: ${sizeInKb} KB`)

  return augmentedItems
}

function extractCloudDifferentiator(actorName: string) {
  const match = actorName.match(/^([^-]+)-/)
  if (!match) {
    throw new Error(
      `Could not extract cloud differentiator from actor name: ${actorName}`,
    )
  }
  return match[1]
}
