import { Summary } from '@iliazlobin/functions/blog/types'
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from '@langchain/core/prompts'
import { RunnableSequence } from '@langchain/core/runnables'
import { ChatOpenAI } from '@langchain/openai'

import { JsonOutputFunctionsParser } from 'langchain/output_parsers'
import { Config } from 'sst/node/config'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

interface Event {
  title: string
  text: string
}

interface Context {}

const BlogPostInsightsZod = z.object({
  summary: z.string().describe('one sentence sumamry of the blog post'),
  takeaways: z
    .array(z.string())
    .describe(
      '3-5 (depending on the length of the blog post) key takeaways from the blog post',
    ),
  technologies: z
    .array(z.string())
    .describe(
      'the key cloud services and technologies mentioined in the blog post',
    ),
  stakeholders: z
    .array(z.string())
    .describe(
      'groups of stakeholders who would be interested in the blog post',
    ),
})

export async function handler(
  event: Event,
  context: Context,
): Promise<Summary> {
  // console.debug('[DEBUG] event: ', event)
  console.debug('[DEBUG] event.title: ', event.title)
  // console.debug('[DEBUG] cloud: ', Config.cloud)

  const chatTemplate = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
      `You are a professional cloud architect with solid analytic skills. You know everything about {cloud} and are always up to date with the latest news. You excel at analyzing blog post articles taking clear summaries and takeaways.`,
    ),
    HumanMessagePromptTemplate.fromTemplate(
      `I want you to analyze this blog post and provide me with the key insights about it. Blog post title: {title}. Blog post text: {text}.`,
    ),
  ])

  const model = new ChatOpenAI({
    modelName: Config.openaiModel,
    openAIApiKey: Config.openaiApiKey,
    temperature: 0,
  })

  // const parser = StructuredOutputParser.fromZodSchema(BlogPostInsightsZod)
  const parser = new JsonOutputFunctionsParser<Summary>()

  const chain = RunnableSequence.from([
    chatTemplate,
    model.bind({
      functions: [
        {
          name: 'output_formatter',
          description: 'Should always be used to properly format output',
          parameters: zodToJsonSchema(BlogPostInsightsZod),
        },
      ],
      function_call: { name: 'output_formatter' },
    }),
    parser,
  ])
  // const chain = RunnableSequence.from([messagesTemplate, model])

  const result = await chain.invoke({
    title: event.title,
    text: event.text,
    cloud: Config.cloud,
  })
  console.log('[DEBUG] results: ', result)

  const blogPostInisghts = BlogPostInsightsZod.parse(result)

  return blogPostInisghts
}
