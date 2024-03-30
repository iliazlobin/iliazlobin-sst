import { blogWorkflow } from './blogWorkflow'
// import { HttpApi, HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2'
import apigwv2, {
  HttpApi,
  HttpIntegrationSubtype,
  HttpMethod,
  ParameterMapping,
} from 'aws-cdk-lib/aws-apigatewayv2'
import {
  HttpLambdaIntegration,
  HttpStepFunctionsIntegration,
} from 'aws-cdk-lib/aws-apigatewayv2-integrations'
// import {
//   HttpLambdaIntegration,
//   HttpStepFunctionsIntegration,
// } from 'aws-cdk-lib/aws-apigatewayv2-integrations'
// import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda'
import { dirname } from 'path'
import { Api, StackContext, use } from 'sst/constructs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export function publicHttpApi({ stack }: StackContext) {
  const { awsStateMachine: awsBlogSummarizerStateMachine } = use(blogWorkflow)

  const publicHttpApi = new HttpApi(stack, 'publicHttpApi', {
    apiName: `${stack.stage}-iliazlobin-publicHttpApi`,
  })

  publicHttpApi.addRoutes({
    path: '/start-machine',
    methods: [HttpMethod.POST],
    integration: new HttpStepFunctionsIntegration(
      'blogSummarizerHttpStepFunctionsIntegration',
      {
        stateMachine: awsBlogSummarizerStateMachine,
        subtype: HttpIntegrationSubtype.STEPFUNCTIONS_START_EXECUTION,
        parameterMapping: new ParameterMapping()
          .custom('Input', '$request.body')
          .custom(
            'StateMachineArn',
            awsBlogSummarizerStateMachine.stateMachineArn,
          ),
      },
    ),
  })

  const publicApi = new Api(stack, 'publicApi', {
    // defaults: {
    //   function: {
    //     // bind: [bus, notionTable, notionBucket],
    //     // environment: {
    //     //   NOTION_BUCKET: notionBucket.bucketName,
    //     //   NOTION_TABLE: notionTable.tableName,
    //     // },
    //   },
    // },
    // routes: {
    //   'POST /start': 'packages/functions/blog-summarizer/action.start',
    //   // 'GET /start-machine': {
    //   // },
    // },
    cdk: {
      httpApi: HttpApi.fromHttpApiAttributes(stack, 'publicHttpApi_', {
        httpApiId: publicHttpApi.httpApiId,
      }),
    },
  })

  stack.addOutputs({
    // httpApi: httpApi.url,
    api: publicApi.url,
  })
}
