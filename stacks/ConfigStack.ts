import { Config, StackContext } from 'sst/constructs'

export function ConfigStack({ stack }: StackContext) {
  const VERSION = new Config.Parameter(stack, 'VERSION', {
    value: '1.2.0',
  })
  const SITE_DOMAIN = new Config.Parameter(stack, 'SITE_DOMAIN', {
    value: 'iliazlobin.com',
  })
  const STATIC_DOMAIN = new Config.Parameter(stack, 'STATIC_DOMAIN', {
    value: 'static.iliazlobin.com',
  })
  const NOTION_TOKEN = new Config.Secret(stack, 'NOTION_TOKEN')
  return {
    VERSION,
    SITE_DOMAIN,
    STATIC_DOMAIN,
    NOTION_TOKEN,
  }
}
