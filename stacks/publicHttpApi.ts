// import { authorizer } from './authorizer'
// import { blogWorkflow } from './blogWorkflow'
// // import { HttpApi, HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2'
// import apigwv2, {
//   CfnStage,
//   HttpApi,
//   HttpIntegrationSubtype,
//   HttpMethod,
//   ParameterMapping,
// } from 'aws-cdk-lib/aws-apigatewayv2'
// import {
//   HttpLambdaAuthorizer,
//   HttpLambdaResponseType,
// } from 'aws-cdk-lib/aws-apigatewayv2-authorizers'
// import {
//   HttpLambdaIntegration,
//   HttpStepFunctionsIntegration,
// } from 'aws-cdk-lib/aws-apigatewayv2-integrations'
// import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs'
// import { Duration } from 'aws-cdk-lib/core'
// // import {
// //   HttpLambdaIntegration,
// //   HttpStepFunctionsIntegration,
// // } from 'aws-cdk-lib/aws-apigatewayv2-integrations'
// // import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda'
// import { dirname } from 'path'
// import { Api, Function, StackContext, use } from 'sst/constructs'
// import { fileURLToPath } from 'url'

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = dirname(__filename)

// export function publicHttpApi({ stack }: StackContext) {
//   const { awsStateMachine: awsBlogSummarizerStateMachine } = use(blogWorkflow)
//   const { authorizerFunction } = use(authorizer)

//   const publicHttpApi = new HttpApi(stack, 'publicHttpApi', {
//     apiName: `${stack.stage}-iliazlobin-publicHttpApi`,
//   })

//   // const httpApiLogGroup = new LogGroup(stack, 'MyLogGroup', {
//   //   logGroupName: '/aws/httpApiLogs',
//   //   retention: RetentionDays.FIVE_DAYS,
//   // })

//   // const defaultStage = publicHttpApi.defaultStage!.node.defaultChild as CfnStage
//   // defaultStage.accessLogSettings = {
//   //   destinationArn: httpApiLogGroup.logGroupArn,
//   //   format: JSON.stringify({
//   //     requestId: '$context.requestId',
//   //     userAgent: '$context.identity.userAgent',
//   //     sourceIp: '$context.identity.sourceIp',
//   //     requestTime: '$context.requestTime',
//   //     httpMethod: '$context.httpMethod',
//   //     path: '$context.path',
//   //     status: '$context.status',
//   //     responseLength: '$context.responseLength',
//   //   }),
//   // }

//   const lambdaAuthorizer = new HttpLambdaAuthorizer(
//     'lambdaAuthorizer',
//     authorizerFunction,
//     {
//       responseTypes: [HttpLambdaResponseType.SIMPLE],
//       identitySource: [
//         '$request.header.Authorization',
//         // '$request.header',
//       ],
//       resultsCacheTtl: Duration.seconds(5),
//     },
//   )

//   publicHttpApi.addRoutes({
//     path: '/blog/process',
//     methods: [HttpMethod.POST],
//     authorizer: lambdaAuthorizer,
//     integration: new HttpStepFunctionsIntegration(
//       'blogSummarizerHttpStepFunctionsIntegration',
//       {
//         stateMachine: awsBlogSummarizerStateMachine,
//         subtype: HttpIntegrationSubtype.STEPFUNCTIONS_START_EXECUTION,
//         parameterMapping: new ParameterMapping()
//           .custom('Input', '$request.body')
//           .custom(
//             'StateMachineArn',
//             awsBlogSummarizerStateMachine.stateMachineArn,
//           ),
//       },
//     ),
//   })

//   const publicApi = new Api(stack, 'publicApi', {
//     // accessLog: {
//     //   format:
//     //     '$context.identity.sourceIp,$context.requestTime,$context.httpMethod,$context.routeKey,$context.protocol,$context.status,$context.responseLength,$context.requestId',
//     //   retention: 'five_days',
//     //   destinationArn: httpApiLogGroup.logGroupArn,
//     // },
//     authorizers: {
//       defaultAuthorizer: {
//         type: 'lambda',
//         function: authorizerFunction,
//         resultsCacheTtl: '30 seconds',
//       },
//     },
//     defaults: {
//       authorizer: 'defaultAuthorizer',
//     },
//     // defaults: {
//     //   function: {
//     //     // bind: [bus, notionTable, notionBucket],
//     //     // environment: {
//     //     //   NOTION_BUCKET: notionBucket.bucketName,
//     //     //   NOTION_TABLE: notionTable.tableName,
//     //     // },
//     //   },
//     // },
//     // routes: {
//     //   'POST /start': 'packages/functions/blog-summarizer/action.start',
//     //   // 'GET /start-machine': {
//     //   // },
//     // },
//     cdk: {
//       httpApi: HttpApi.fromHttpApiAttributes(stack, 'publicHttpApi_', {
//         httpApiId: publicHttpApi.httpApiId,
//       }),
//     },
//   })

//   stack.addOutputs({
//     // httpApi: httpApi.url,
//     api: publicApi.url,
//   })
// }
