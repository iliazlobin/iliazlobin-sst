import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from '@langchain/core/prompts'
import { RunnableSequence } from '@langchain/core/runnables'
import { ChatOpenAI } from '@langchain/openai'

import {
  JsonOutputFunctionsParser,
  StructuredOutputParser,
} from 'langchain/output_parsers'
import { Config } from 'sst/node/config'
import { expect, it } from 'vitest'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

export type BlogPostInsights = {
  summary: string
  takeaways: string[]
}

it.skip('langchain openai function calling with zod validation', async () => {
  const BlogPostInsightsZod = z.object({
    summary: z.string().describe('one sentence sumamry of the blog post'),
    takeaways: z
      .array(z.string())
      .describe(
        '3-5 (depending on the length of the blog post) key takeaways from the blog post',
      ),
  })

  const zodParser = StructuredOutputParser.fromZodSchema(BlogPostInsightsZod)
  const functionsParser = new JsonOutputFunctionsParser<BlogPostInsights>()

  const chatTemplate = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
      `You are a professional cloud architect with solid analytic skills. You know everything about {cloud} and are always up to date with the latest news. You excel at analyzing blog post articles taking clear summaries and takeaways.`,
    ),
    HumanMessagePromptTemplate.fromTemplate(
      `I want you to analyze this blog post and provide me with the key insights about it. Blog post title: {title}. Blog post text: {text}.`,
    ),
  ])

  const key = Config.openaiApiKey

  const model = new ChatOpenAI({
    modelName: Config.openaiModel,
    openAIApiKey: Config.openaiApiKey,
    // temperature: 0,
  }).bind({
    functions: [
      {
        name: 'output_formatter',
        description: 'Should always be used to properly format output',
        parameters: zodToJsonSchema(BlogPostInsightsZod),
      },
    ],
    function_call: { name: 'output_formatter' },
  })

  // const chain = RunnableSequence.from([chatTemplate, model, parser])
  const chain = RunnableSequence.from([chatTemplate, model, functionsParser])
  // const chain = RunnableSequence.from([messagesTemplate, model])

  const title =
    'Guernsey County, Ohio, modernizes its emergency response with AWS | AWS Public Sector Blog'
  const text =
    ' \n        \n       In a small corner of Ohio, Guernsey County is leading the nation by example. Home to a technologically advanced 911 call center, the county has taken the pioneering step to move its emergency call handling into the cloud. With a powerful blend of cloud-centered solutions, it has positioned itself as an innovator in emergency response, breaking away from limitations and embracing a future that is faster, more efficient, and safer for its citizens. \n       From analog to digital: The transformation story \n       Until recently, the county’s 911 system was anchored in pre-internet analog technology, restricting emergency calls to two-way voice conversations.'

  const result = await chain.invoke({
    title: title,
    text: text,
    cloud: 'aws',
  })

  const blogPostInisghts = BlogPostInsightsZod.parse(result)

  console.log('[DEBUG] blogPostInisghts: ', blogPostInisghts)

  expect(result).toBeDefined()
})
