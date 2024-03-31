import { Config, StackContext } from 'sst/constructs'

export function allConfig({ stack }: StackContext) {
  const version = new Config.Parameter(stack, 'version', {
    value: '1.2.0',
  })

  // domains
  const siteDomain = new Config.Parameter(stack, 'siteDomain', {
    value:
      stack.stage === 'prod'
        ? 'iliazlobin.com'
        : `${stack.stage}.iliazlobin.com`,
  })
  const staticDomain = new Config.Parameter(stack, 'staticDomain', {
    value:
      stack.stage === 'prod'
        ? 'static.iliazlobin.com'
        : `static.${stack.stage}.iliazlobin.com`,
  })

  // apify
  const apifyToken = new Config.Secret(stack, 'apifyToken')

  // notion
  const notionToken = new Config.Secret(stack, 'notionToken')
  const blogNotionDatabase = new Config.Parameter(
    stack,
    'blogSummarizerNotionDatabase',
    { value: 'eee29f37ef0f4ff99b8b03fdd7538334' },
  )

  // openai
  const openaiApiKey = new Config.Secret(stack, 'openaiApiKey')
  const openaiModel = new Config.Parameter(stack, 'openaiModel', {
    value: 'gpt-3.5-turbo-1106',
  })

  return {
    version: version,
    siteDomain: siteDomain,
    staticDomain: staticDomain,
    notionToken: notionToken,
    apifyToken: apifyToken,
    openaiApiKey: openaiApiKey,
    openaiModel: openaiModel,
    blogNotionDatabase: blogNotionDatabase,
  }
}
