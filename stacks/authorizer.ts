import {
  Bucket,
  Distribution,
  Function,
  StackContext,
  Table,
  use,
} from 'sst/constructs'

export function authorizer({ stack }: StackContext) {
  const authorizationTokens = new Table(stack, 'authorizationTokens', {
    fields: {
      token: 'string',
    },
    primaryIndex: { partitionKey: 'token' },
  })

  const authorizerFunction = new Function(stack, 'authorizerFunction', {
    bind: [authorizationTokens],
    handler: 'packages/functions/authorizer/tokenAuthorizer.handler',
    memorySize: 128,
    timeout: 5,
  })

  stack.addOutputs({
    authorizerTable: authorizationTokens.id,
  })

  return {
    authorizerFunction,
  }
}
