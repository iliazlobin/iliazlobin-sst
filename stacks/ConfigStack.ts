import { Config, StackContext } from 'sst/constructs'

export function ConfigStack({ stack }: StackContext) {
  const version = new Config.Parameter(stack, 'version', {
    value: '1.2.0',
  })
  const siteDomain = new Config.Parameter(stack, 'siteDomain', {
    value: 'iliazlobin.com',
  })
  const staticDomain = new Config.Parameter(stack, 'staticDomain', {
    value: 'static.iliazlobin.com',
  })
  const notionToken = new Config.Secret(stack, 'notionToken')

  return {
    version: version,
    siteDomain: siteDomain,
    staticDomain: staticDomain,
    notionToken: notionToken,
  }
}
