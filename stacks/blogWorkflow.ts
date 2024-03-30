import {
  Choice,
  Condition,
  DefinitionBody,
  InputType,
  JsonPath,
  Map,
  Pass,
  StateMachine,
  Succeed
} from 'aws-cdk-lib/aws-stepfunctions'
import { LambdaInvoke } from 'aws-cdk-lib/aws-stepfunctions-tasks'
import { Config, Function, StackContext, use } from 'sst/constructs'
import { allConfig } from './allConfig'

export function blogWorkflow({ stack }: StackContext) {
  const {
    apifyToken,
    notionToken,
    blogSummarizerNotionDatabase,
    openaiApiKey,
    openaiModel,
  } = use(allConfig)

  const cloud = new Config.Parameter(stack, 'cloud', { value: 'aws' })

  const summarizeDocument = new LambdaInvoke(stack, 'summarizeDocument', {
    lambdaFunction: new Function(stack, 'summarizeDocumentFunction', {
      bind: [openaiApiKey, openaiModel, cloud],
      handler: 'packages/functions/blog/handlers/summarizeDocument.handler',
      // environment: {
      //   API_KEY: process.env.API_KEY ?? '',
      // },
      memorySize: 256,
      timeout: stack.stage === 'dev' ? 60 : 20,
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
    resultPath: '$.summarizeDocument',
    // outputPath: '$.Payload',
  })

  const saveDocument = new LambdaInvoke(stack, 'saveDocument', {
    lambdaFunction: new Function(stack, 'saveDocumentFunction', {
      bind: [notionToken, blogSummarizerNotionDatabase, cloud],
      handler: 'packages/functions/blog/handlers/saveDocument.handler',
      // environment: {
      //   API_KEY: process.env.API_KEY ?? '',
      // },
      memorySize: 256,
      timeout: stack.stage === 'dev' ? 60 : 10,
    }),
    // inputPath: '$',
    payload: {
      type: InputType.TEXT,
      value: {
        'item.$': '$',
        'summary.$': '$.summarizeDocument.result',
      },
    },
    resultSelector: {
      'result.$': '$.Payload',
    },
    resultPath: '$.saveDocument',
    // outputPath: '$.Payload',
  })

  const iterateItemsSuccess = new Succeed(stack, 'iterateItemsSuccess')

  const documentDoesntExistRoutine = summarizeDocument
    .next(saveDocument)
    .next(iterateItemsSuccess)

  const ifDocumentExistChoice = new Choice(stack, 'ifDocumentExist')
  const documentExistCondition = Condition.booleanEquals(
    '$.checkDocumentExist.result.documentExist',
    true,
  )
  const choiceRoutine = ifDocumentExistChoice
    .when(documentExistCondition, iterateItemsSuccess)
    .otherwise(documentDoesntExistRoutine)

  const checkDocumentExist = new LambdaInvoke(stack, 'checkDocumentExist', {
    lambdaFunction: new Function(stack, 'checkDocumentExistFunction', {
      bind: [notionToken, blogSummarizerNotionDatabase],
      handler: 'packages/functions/blog/handlers/checkDocumentExist.handler',
      // environment: {
      //   // API_KEY: process.env.API_KEY ?? '',
      // },
      memorySize: 256,
      timeout: stack.stage === 'dev' ? 60 : 10,
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
    resultPath: '$.checkDocumentExist',
    // outputPath: '$.Payload',
  })

  const mapRoutine = checkDocumentExist.next(choiceRoutine)

  const iterateItemsMapRoutine = new Map(stack, 'iterateItemsMapRoutine', {
    itemsPath: JsonPath.stringAt('$.retrieveItems.result'),
    // itemSelector: {
    //   item: JsonPath.stringAt('$$.Map.Item.Value'),
    // },
    // resultPath: '$.mapOutput',
    maxConcurrency: 1,
  })

  iterateItemsMapRoutine.itemProcessor(mapRoutine)

  const retrieveItems = new LambdaInvoke(stack, 'retrieveItems', {
    lambdaFunction: new Function(stack, 'retrieveItemsFunction', {
      bind: [apifyToken],
      handler: 'packages/functions/blog/handlers/retrieveItems.handler',
      // environment: {
      //   // API_KEY: process.env.API_KEY ?? '',
      // },
      memorySize: 256,
      timeout: stack.stage === 'dev' ? 60 : 10,
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
    resultPath: '$.retrieveItems',
    // outputPath: '$.retrieveItems',
  })

  const finish = new Pass(stack, 'Finish')

  const definition = retrieveItems.next(iterateItemsMapRoutine).next(finish)

  const awsStateMachine = new StateMachine(stack, 'AWSStateMachine', {
    definitionBody: DefinitionBody.fromChainable(definition),
  })

  stack.addOutputs({
    awsStateMachine: awsStateMachine.toString(),
  })

  return {
    awsStateMachine: awsStateMachine,
  }
}
