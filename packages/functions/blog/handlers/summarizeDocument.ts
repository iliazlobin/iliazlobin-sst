import { Summary } from '@iliazlobin/functions/blog/types'
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from '@langchain/core/prompts'
import { RunnableSequence } from '@langchain/core/runnables'
import { ChatOpenAI } from '@langchain/openai'

import { extractSummary } from '../openai'
import { JsonOutputFunctionsParser } from 'langchain/output_parsers'
import { Config } from 'sst/node/config'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

interface Event {
  title: string
  text: string
  cloud: string
}

interface Context {}

export async function handler(
  event: Event,
  context: Context,
): Promise<Summary> {
  // console.debug('[DEBUG] event: ', event)
  console.debug('[DEBUG] event.title: ', event.title)
  // console.debug('[DEBUG] cloud: ', Config.cloud)

  const text = event.text
  const textSizeInBytes = Buffer.byteLength(text, 'utf8')
  console.debug(`[DEBUG] text size is: ${textSizeInBytes / 1024} KB`)

  let finalText = text
  if (textSizeInBytes > 50 * 1024) {
    finalText = text.slice(0, 50 * 1024)
    console.warn('[WARN] text size exceeded 50 KB. Truncated to 50 KB.')
  }

  const summary = await extractSummary({
    title: event.title,
    text: finalText,
    cloud: event.cloud,
  })

  return summary
}
