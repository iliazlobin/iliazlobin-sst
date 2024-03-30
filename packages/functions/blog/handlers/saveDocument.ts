import { upsertDocumentIntoDatabase } from '@iliazlobin/functions/blog/notion'
import { Item, Summary } from '@iliazlobin/functions/blog/types'

interface Event {
  item: Item
  summary: Summary
}

interface Context {}

export async function handler(event: Event, context: Context): Promise<any> {
  console.debug(`[DEBUG] event: ${event}`)

  const result = await upsertDocumentIntoDatabase({
    item: event.item,
    summary: event.summary,
  })
  console.debug(`[DEBUG] result: ${result}`)

  return {
    documentId: result.documentId,
  }
}
