import { Item } from './types'
import { ApifyClient, ApifyClientOptions, Dataset } from 'apify'
import { Config } from 'sst/node/config'

export async function retrieveItems({
  datasetId,
}: {
  datasetId: string
}): Promise<Item[]> {
  const token = process.env.APIFY_TOKEN // Replace with your method to get the token

  const options: ApifyClientOptions = {
    token: Config.apifyToken,
  }

  const apifyClient = new ApifyClient(options)
  const dataset = new Dataset({ id: datasetId, client: apifyClient }) // Fix: Pass dataset ID and client as an object
  const datasetItems = await dataset.getData()

  return datasetItems.items as Item[]
}
