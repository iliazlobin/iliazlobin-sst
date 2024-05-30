import { allConfig } from './allConfig'
import {
  Choice,
  Condition,
  DefinitionBody,
  InputType,
  JitterType,
  JsonPath,
  Map,
  Pass,
  StateMachine,
  Succeed,
  Timeout,
} from 'aws-cdk-lib/aws-stepfunctions'
import { LambdaInvoke } from 'aws-cdk-lib/aws-stepfunctions-tasks'
import { Duration } from 'aws-cdk-lib/core'
import { Function, StackContext, use } from 'sst/constructs'

export function blogWorkflow({ stack }: StackContext) {
  const {
    apifyToken,
    notionToken,
    blogNotionDatabase: blogSummarizerNotionDatabase,
    openaiApiKey,
    openaiModel,
  } = use(allConfig)

  const summarizeDocumentTimeout = Duration.seconds(
    // stack.stage === 'dev' ? 60 : 20,
    stack.stage === 'dev' ? 20 : 20,
  )
  const summarizeDocument = new LambdaInvoke(stack, 'summarizeDocument', {
    lambdaFunction: new Function(stack, 'summarizeDocumentFunction', {
      bind: [openaiApiKey, openaiModel],
      handler: 'packages/functions/blog/handlers/summarizeDocument.handler',
      memorySize: 256,
      timeout: summarizeDocumentTimeout.toSeconds(),
    }),
    // inputPath: '$',
    payload: {
      type: InputType.TEXT,
      value: {
        'title.$': '$.title',
        'cloud.$': '$.cloud',
        'text.$': '$.$retrieveItemText.result.text',
      },
    },
    resultSelector: {
      'result.$': '$.Payload',
    },
    resultPath: '$.$summarizeDocument',
    // outputPath: '$.Payload',
    taskTimeout: Timeout.duration(summarizeDocumentTimeout),
  })

  summarizeDocument.addRetry({
    errors: ['States.Timeout'],
    interval: Duration.seconds(5),
    maxDelay: Duration.seconds(20),
    jitterStrategy: JitterType.FULL,
    maxAttempts: 3,
    backoffRate: 2,
  })

  const saveDocumentTimeout = Duration.seconds(
    // stack.stage === 'dev' ? 60 : 20,
    stack.stage === 'dev' ? 20 : 20,
  )
  const saveDocument = new LambdaInvoke(stack, 'saveDocument', {
    lambdaFunction: new Function(stack, 'saveDocumentFunction', {
      bind: [notionToken, blogSummarizerNotionDatabase],
      handler: 'packages/functions/blog/handlers/saveDocument.handler',
      memorySize: 256,
      timeout: saveDocumentTimeout.toSeconds(),
    }),
    // inputPath: '$',
    payload: {
      type: InputType.TEXT,
      value: {
        'item.$': '$',
        'summary.$': '$.$summarizeDocument.result',
      },
    },
    resultSelector: {
      'result.$': '$.Payload',
    },
    resultPath: '$.$saveDocument',
    // resultPath: JsonPath.DISCARD,
    outputPath: '$.url',
    taskTimeout: Timeout.duration(saveDocumentTimeout),
  })

  saveDocument.addRetry({
    errors: ['Error', 'APIResponseError'],
    interval: Duration.seconds(5),
    maxDelay: Duration.seconds(20),
    jitterStrategy: JitterType.FULL,
    maxAttempts: 3,
    backoffRate: 2,
  })

  const retrieveItemText = new LambdaInvoke(stack, 'retrieveItemText', {
    lambdaFunction: new Function(stack, 'retrieveItemTextFunction', {
      bind: [apifyToken],
      handler: 'packages/functions/blog/handlers/retrieveItemText.handler',
      memorySize: 256,
      timeout: stack.stage === 'dev' ? 60 : 10,
    }),
    // inputPath: '$',
    payload: {
      type: InputType.TEXT,
      value: {
        'datasetId.$': '$.datasetId',
        'url.$': '$.url',
      },
    },
    resultSelector: {
      'result.$': '$.Payload',
    },
    resultPath: '$.$retrieveItemText',
    // outputPath: '$.Payload',
  })

  const iterateItemsSuccess = new Succeed(stack, 'iterateItemsSuccess')
  const documentDoesntExistRoutine = retrieveItemText
    .next(summarizeDocument)
    .next(saveDocument)
    .next(iterateItemsSuccess)

  const ifDocumentExistChoice = new Choice(stack, 'ifDocumentExist')
  const documentExistCondition = Condition.booleanEquals(
    '$.$checkDocumentExist.result.documentExist',
    true,
  )
  const choiceRoutine = ifDocumentExistChoice
    .when(documentExistCondition, iterateItemsSuccess)
    .otherwise(documentDoesntExistRoutine)

  const checkDocumentExistTimeout = Duration.seconds(
    // stack.stage === 'dev' ? 60 : 20,
    stack.stage === 'dev' ? 20 : 20,
  )
  const checkDocumentExist = new LambdaInvoke(stack, 'checkDocumentExist', {
    lambdaFunction: new Function(stack, 'checkDocumentExistFunction', {
      bind: [notionToken, blogSummarizerNotionDatabase],
      handler: 'packages/functions/blog/handlers/checkDocumentExist.handler',
      // environment: {
      //   // API_KEY: process.env.API_KEY ?? '',
      // },
      memorySize: 256,
      timeout: checkDocumentExistTimeout.toSeconds(),
    }),
    // inputPath: '$',
    payload: {
      type: InputType.TEXT,
      value: {
        'url.$': '$.url',
      },
    },
    resultSelector: {
      'result.$': '$.Payload',
    },
    resultPath: '$.$checkDocumentExist',
    // outputPath: '$.Payload',
    taskTimeout: Timeout.duration(checkDocumentExistTimeout),
  })

  const mapRoutine = checkDocumentExist.next(choiceRoutine)

  const iterateItemsMapRoutine = new Map(stack, 'iterateItemsMapRoutine', {
    itemsPath: JsonPath.stringAt('$.$retrieveItems.result'),
    // itemSelector: {
    //   item: JsonPath.stringAt('$$.Map.Item.Value'),
    // },
    // resultPath: '$.mapOutput',
    maxConcurrency: 3,
  })

  iterateItemsMapRoutine.itemProcessor(mapRoutine)

  const retrieveItemsTimeout = Duration.seconds(
    // stack.stage === 'dev' ? 60 : 20,
    stack.stage === 'dev' ? 20 : 20,
  )
  const retrieveItems = new LambdaInvoke(stack, 'retrieveItems', {
    lambdaFunction: new Function(stack, 'retrieveItemsFunction', {
      bind: [apifyToken],
      handler: 'packages/functions/blog/handlers/retrieveItems.handler',
      // environment: {
      //   // API_KEY: process.env.API_KEY ?? '',
      // },
      memorySize: 256,
      timeout: retrieveItemsTimeout.toSeconds(),
    }),
    // inputPath: '$',
    // payload: {
    //   type: InputType.TEXT,
    //   value: {
    //     'url.$': '$.url',
    //   },
    // },
    resultSelector: {
      'result.$': '$.Payload',
    },
    resultPath: '$.$retrieveItems',
    // outputPath: '$.retrieveItems',
    taskTimeout: Timeout.duration(retrieveItemsTimeout),
  })

  const finish = new Pass(stack, 'Finish')

  const definition = retrieveItems.next(iterateItemsMapRoutine).next(finish)

  // const awsStateMachine = new StateMachine(stack, `${stack.stage}AWSStateMachine`, {
  const awsStateMachine = new StateMachine(
    stack,
    `${stack.stage}-AWSStateMachine`,
    {
      // const awsStateMachine = new StateMachine(stack, 'AWSStateMachine', {
      definitionBody: DefinitionBody.fromChainable(definition),
    },
  )

  stack.addOutputs({
    awsStateMachine: awsStateMachine.toString(),
  })

  return {
    awsStateMachine: awsStateMachine,
  }
}
