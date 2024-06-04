import { findDocumentByUrl } from '@iliazlobin/functions/blog/notion'

export interface Event {
  url: string
}

interface Context {}

export async function handler(
  event: Event,
  context: Context,
): Promise<{ documentExist: boolean }> {
  console.log(`[DEBUG] event: ${event}`)

  const url = event.url
  console.log(`[DEBUG] url: ${url}`)

  const items = await findDocumentByUrl({ url: url })

  if (items.length === 0) {
    return { documentExist: false }
  }

  return { documentExist: true }
}
