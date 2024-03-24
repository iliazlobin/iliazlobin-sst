import { ConfigStack } from '@/stacks/ConfigStack'
import { DataStack } from '@/stacks/DataStack'

import { Api, EventBus, StackContext, use } from 'sst/constructs'

export function ApiStack({ stack }: StackContext) {
  const bus = new EventBus(stack, 'bus', {
    defaults: {
      retries: 10,
    },
  })

  const { notionTable, notionBucket } = use(DataStack)
  const { NOTION_TOKEN, STATIC_DOMAIN } = use(ConfigStack)

  const api = new Api(stack, 'api', {
    defaults: {
      function: {
        bind: [bus, notionTable, notionBucket, NOTION_TOKEN],
        // environment: {
        //   NOTION_BUCKET: notionBucket.bucketName,
        //   NOTION_TABLE: notionTable.tableName,
        // },
      },
    },
    routes: {
      // 'GET /': 'packages/api/lambda.handler',
      // 'GET /todo': 'packages/api/todo.list',
      // 'POST /todo': 'packages/api/todo.create',
      // 'GET /notion/list': 'packages/api/api/notion.exportPage',
    },
  })

  // bus.subscribe('todo.created', {
  //   handler: 'events/todo-created.handler',
  // })

  stack.addOutputs({
    ApiEndpoint: api.url,
  })
}
