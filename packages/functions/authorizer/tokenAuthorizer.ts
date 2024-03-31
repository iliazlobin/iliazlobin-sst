import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb'

import { Table } from 'sst/node/table'

interface Context {}
interface Event {
  headers: {
    authorization: string
  }
  routeArn: string
  rawPath: string
  identitySource: string[]
}

const client = new DynamoDBClient({})
const tableName = Table.authorizationTokens.tableName

export async function handler(event: Event, context: Context): Promise<any> {
  // console.log('[DEBUG] event: ', event)

  const authorizationHeader = event.headers?.authorization
  const token = authorizationHeader?.split(' ')[1]

  const routeArn = event.routeArn
  // routeArn='arn:aws:execute-api:us-east-1:643713846674:tqnqj3hg8b/$default/POST/blog/process'

  const match = routeArn.match(
    /arn:aws:execute-api:(.+?):(.+?):.+?\/\$default\/(.+?)\/(.*)/,
  )
  if (!match) {
    throw new Error(`Invalid routeArn`)
  }
  const region = match[1]
  const accountId = match[2]
  const method = match[3]
  const path = `/${match[4]}`
  console.debug(
    `[DEBUG] region: ${region}, accountId: ${accountId}, method: ${method}, path: ${path}`,
  )

  const userAgent = event.headers['user-agent']

  const input = {
    TableName: tableName,
    Key: {
      token: { S: token },
    },
  }

  const command = new GetItemCommand(input)
  const response = await client.send(command)

  if (response.$metadata.httpStatusCode !== 200) {
    console.error(`Bad status code`)
    throw new Error(`Bad status code`)
  }

  const item = response.Item
  if (!item?.token?.S || !item?.principal?.S) {
    return {
      isAuthorized: false,
      context: {
        accountId,
        region,
        method,
        path,
        userAgent,
      },
    }
  }

  const principal = item.principal.S

  let policyPassed = false

  const policy = item?.policy?.SS || []
  if (policy.length === 0) {
    policyPassed = true
  }

  for (const rule of policy) {
    console.debug(`[DEBUG] rule: ${rule}`)
    const [ruleMethod, rulePath] = rule.split(':')
    console.debug(`[DEBUG] ruleMethod: ${ruleMethod}, rulePath: ${rulePath}`)
    if (method.startsWith(ruleMethod) && path.startsWith(rulePath)) {
      policyPassed = true
      break
    }
  }

  if (!policyPassed) {
    console.warn(`Policy not passed`)
    return {
      isAuthorized: false,
      context: {
        principal,
        accountId,
        region,
        method,
        path,
        userAgent,
        policyPassed,
      },
    }
  }

  console.info(`[INFO] Authorized`)
  return {
    isAuthorized: true,
    context: {
      principal,
      accountId,
      region,
      method,
      path,
      userAgent,
      policyPassed,
    },
  }
}
