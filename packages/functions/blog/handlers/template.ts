interface Event {
  title: string
  text: string
}

interface Context {}

export async function handler(event: Event, context: Context): Promise<void> {
  console.debug(`[DEBUG] event: ${event}`)
  // console.debug(`[DEBUG] event.title: ${event?.title}`)
  // console.debug(`[DEBUG] cloud: ${Config.cloud}`)
}
