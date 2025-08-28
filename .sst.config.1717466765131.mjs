import { createRequire as topLevelCreateRequire } from 'module';const require = topLevelCreateRequire(import.meta.url);
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// stacks/allConfig.ts
import { Config } from "sst/constructs";
function allConfig({ stack }) {
  const version = new Config.Parameter(stack, "version", {
    value: "1.2.0"
  });
  const siteDomain = new Config.Parameter(stack, "siteDomain", {
    value: stack.stage === "prod" ? "iliazlobin.com" : `${stack.stage}.iliazlobin.com`
  });
  const staticDomain = new Config.Parameter(stack, "staticDomain", {
    value: stack.stage === "prod" ? "static.iliazlobin.com" : `static.${stack.stage}.iliazlobin.com`
  });
  const apifyBlogProcessToken = new Config.Secret(
    stack,
    "apifyBlogProcessToken"
  );
  const apifyToken = new Config.Secret(stack, "apifyToken");
  const notionToken = new Config.Secret(stack, "notionToken");
  const blogNotionDatabase = new Config.Parameter(
    stack,
    "blogSummarizerNotionDatabase",
    { value: "eee29f37ef0f4ff99b8b03fdd7538334" }
  );
  const openaiApiKey = new Config.Secret(stack, "openaiApiKey");
  const openaiModel = new Config.Parameter(stack, "openaiModel", {
    value: "gpt-3.5-turbo-1106"
  });
  return {
    version,
    siteDomain,
    staticDomain,
    notionToken,
    apifyToken,
    openaiApiKey,
    openaiModel,
    apifyBlogProcessToken,
    blogNotionDatabase
  };
}
__name(allConfig, "allConfig");

// stacks/authorizer.ts
import {
  Function,
  Table
} from "sst/constructs";
function authorizer({ stack }) {
  const authorizationTokens = new Table(stack, "authorizationTokens", {
    fields: {
      token: "string"
    },
    primaryIndex: { partitionKey: "token" }
  });
  const authorizerFunction = new Function(stack, "authorizerFunction", {
    bind: [authorizationTokens],
    handler: "packages/functions/authorizer/tokenAuthorizer.handler",
    memorySize: 128,
    timeout: 5
  });
  stack.addOutputs({
    authorizerTable: authorizationTokens.id
  });
  return {
    authorizerFunction
  };
}
__name(authorizer, "authorizer");

// stacks/blogWorkflow.ts
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
  Timeout
} from "aws-cdk-lib/aws-stepfunctions";
import { LambdaInvoke } from "aws-cdk-lib/aws-stepfunctions-tasks";
import { Duration } from "aws-cdk-lib/core";
import { Function as Function2, use as use2 } from "sst/constructs";
function blogWorkflow({ stack }) {
  const {
    apifyToken,
    notionToken,
    blogNotionDatabase: blogSummarizerNotionDatabase,
    openaiApiKey,
    openaiModel
  } = use2(allConfig);
  const summarizeDocumentTimeout = Duration.seconds(
    // stack.stage === 'dev' ? 60 : 20,
    stack.stage === "dev" ? 20 : 20
  );
  const summarizeDocument = new LambdaInvoke(stack, "summarizeDocument", {
    lambdaFunction: new Function2(stack, "summarizeDocumentFunction", {
      bind: [openaiApiKey, openaiModel],
      handler: "packages/functions/blog/handlers/summarizeDocument.handler",
      memorySize: 256,
      timeout: summarizeDocumentTimeout.toSeconds()
    }),
    // inputPath: '$',
    payload: {
      type: InputType.TEXT,
      value: {
        "title.$": "$.title",
        "cloud.$": "$.cloud",
        "text.$": "$.$retrieveItemText.result.text"
      }
    },
    resultSelector: {
      "result.$": "$.Payload"
    },
    resultPath: "$.$summarizeDocument",
    // outputPath: '$.Payload',
    taskTimeout: Timeout.duration(summarizeDocumentTimeout)
  });
  summarizeDocument.addRetry({
    errors: ["States.Timeout"],
    interval: Duration.seconds(5),
    maxDelay: Duration.seconds(20),
    jitterStrategy: JitterType.FULL,
    maxAttempts: 3,
    backoffRate: 2
  });
  const saveDocumentTimeout = Duration.seconds(
    // stack.stage === 'dev' ? 60 : 20,
    stack.stage === "dev" ? 20 : 20
  );
  const saveDocument = new LambdaInvoke(stack, "saveDocument", {
    lambdaFunction: new Function2(stack, "saveDocumentFunction", {
      bind: [notionToken, blogSummarizerNotionDatabase],
      handler: "packages/functions/blog/handlers/saveDocument.handler",
      memorySize: 256,
      timeout: saveDocumentTimeout.toSeconds()
    }),
    // inputPath: '$',
    payload: {
      type: InputType.TEXT,
      value: {
        "item.$": "$",
        "summary.$": "$.$summarizeDocument.result"
      }
    },
    resultSelector: {
      "result.$": "$.Payload"
    },
    resultPath: "$.$saveDocument",
    // resultPath: JsonPath.DISCARD,
    outputPath: "$.url",
    taskTimeout: Timeout.duration(saveDocumentTimeout)
  });
  saveDocument.addRetry({
    errors: ["Error", "APIResponseError"],
    interval: Duration.seconds(5),
    maxDelay: Duration.seconds(20),
    jitterStrategy: JitterType.FULL,
    maxAttempts: 3,
    backoffRate: 2
  });
  const retrieveItemText = new LambdaInvoke(stack, "retrieveItemText", {
    lambdaFunction: new Function2(stack, "retrieveItemTextFunction", {
      bind: [apifyToken],
      handler: "packages/functions/blog/handlers/retrieveItemText.handler",
      memorySize: 256,
      timeout: stack.stage === "dev" ? 60 : 10
    }),
    // inputPath: '$',
    payload: {
      type: InputType.TEXT,
      value: {
        "datasetId.$": "$.datasetId",
        "url.$": "$.url"
      }
    },
    resultSelector: {
      "result.$": "$.Payload"
    },
    resultPath: "$.$retrieveItemText"
    // outputPath: '$.Payload',
  });
  const iterateItemsSuccess = new Succeed(stack, "iterateItemsSuccess");
  const documentDoesntExistRoutine = retrieveItemText.next(summarizeDocument).next(saveDocument).next(iterateItemsSuccess);
  const ifDocumentExistChoice = new Choice(stack, "ifDocumentExist");
  const documentExistCondition = Condition.booleanEquals(
    "$.$checkDocumentExist.result.documentExist",
    true
  );
  const choiceRoutine = ifDocumentExistChoice.when(documentExistCondition, iterateItemsSuccess).otherwise(documentDoesntExistRoutine);
  const checkDocumentExistTimeout = Duration.seconds(
    // stack.stage === 'dev' ? 60 : 20,
    stack.stage === "dev" ? 20 : 20
  );
  const checkDocumentExist = new LambdaInvoke(stack, "checkDocumentExist", {
    lambdaFunction: new Function2(stack, "checkDocumentExistFunction", {
      bind: [notionToken, blogSummarizerNotionDatabase],
      handler: "packages/functions/blog/handlers/checkDocumentExist.handler",
      // environment: {
      //   // API_KEY: process.env.API_KEY ?? '',
      // },
      memorySize: 256,
      timeout: checkDocumentExistTimeout.toSeconds()
    }),
    // inputPath: '$',
    payload: {
      type: InputType.TEXT,
      value: {
        "url.$": "$.url"
      }
    },
    resultSelector: {
      "result.$": "$.Payload"
    },
    resultPath: "$.$checkDocumentExist",
    // outputPath: '$.Payload',
    taskTimeout: Timeout.duration(checkDocumentExistTimeout)
  });
  const mapRoutine = checkDocumentExist.next(choiceRoutine);
  const iterateItemsMapRoutine = new Map(stack, "iterateItemsMapRoutine", {
    itemsPath: JsonPath.stringAt("$.$retrieveItems.result"),
    // itemSelector: {
    //   item: JsonPath.stringAt('$$.Map.Item.Value'),
    // },
    // resultPath: '$.mapOutput',
    maxConcurrency: 3
  });
  iterateItemsMapRoutine.itemProcessor(mapRoutine);
  const retrieveItemsTimeout = Duration.seconds(
    // stack.stage === 'dev' ? 60 : 20,
    stack.stage === "dev" ? 20 : 20
  );
  const retrieveItems = new LambdaInvoke(stack, "retrieveItems", {
    lambdaFunction: new Function2(stack, "retrieveItemsFunction", {
      bind: [apifyToken],
      handler: "packages/functions/blog/handlers/retrieveItems.handler",
      // environment: {
      //   // API_KEY: process.env.API_KEY ?? '',
      // },
      memorySize: 256,
      timeout: retrieveItemsTimeout.toSeconds()
    }),
    // inputPath: '$',
    // payload: {
    //   type: InputType.TEXT,
    //   value: {
    //     'url.$': '$.url',
    //   },
    // },
    resultSelector: {
      "result.$": "$.Payload"
    },
    resultPath: "$.$retrieveItems",
    // outputPath: '$.retrieveItems',
    taskTimeout: Timeout.duration(retrieveItemsTimeout)
  });
  const finish = new Pass(stack, "Finish");
  const definition = retrieveItems.next(iterateItemsMapRoutine).next(finish);
  const awsStateMachine = new StateMachine(
    stack,
    `${stack.stage}-AWSStateMachine`,
    {
      // const awsStateMachine = new StateMachine(stack, 'AWSStateMachine', {
      definitionBody: DefinitionBody.fromChainable(definition)
    }
  );
  stack.addOutputs({
    awsStateMachine: awsStateMachine.toString()
  });
  return {
    awsStateMachine
  };
}
__name(blogWorkflow, "blogWorkflow");

// stacks/logger.ts
import colors from "colors";
import * as util from "util";
var { stdout, stderr } = process;
var Logger = class _Logger {
  static {
    __name(this, "Logger");
  }
  isVerbose = true;
  static instance;
  constructor() {
  }
  static getInstance() {
    if (!_Logger.instance) {
      _Logger.instance = new _Logger();
    }
    return _Logger.instance;
  }
  log = (stream, styles) => (fmt, ...args) => {
    let str = util.format(fmt, ...args);
    if (styles && styles.length) {
      str = styles.reduce((a, style) => style(a), str);
    }
    stream.write(str + "\n");
  };
  _debug = this.log(stderr, [colors.gray]);
  debug = (fmt, ...args) => this.isVerbose && this._debug(fmt, ...args);
  error = this.log(stderr, [colors.red]);
  warning = this.log(stderr, [colors.yellow]);
  success = this.log(stderr, [colors.green]);
  info = this.log(stderr, [colors.bold]);
  print = this.log(stderr);
  trace = this.log(stdout);
};
var logger = Logger.getInstance();

// stacks/personalSiteData.ts
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { Bucket as Bucket2, Distribution as Distribution2, Table as Table2, use as use3 } from "sst/constructs";
function personalSiteData({ stack }) {
  const { siteDomain, staticDomain } = use3(allConfig);
  const notionPagesTable = new Table2(stack, "NotionPages", {
    fields: {
      pageId: "string"
      // pageTitle: 'string',
    },
    // primaryIndex: { partitionKey: 'pageId', sortKey: 'pageTitle' },
    primaryIndex: { partitionKey: "pageId" }
  });
  const notionBucket = new Bucket2(stack, "NotionBucket");
  const distribution = new Distribution2(stack, "NotionDistribution", {
    customDomain: staticDomain.value,
    cdk: {
      distribution: {
        comment: "Static assets for a website",
        defaultBehavior: {
          // viewerProtocolPolicy: ViewerProtocolPolicy.HTTPS_ONLY,
          // allowedMethods: AllowedMethods.ALLOW_ALL,
          origin: new S3Origin(notionBucket.cdk.bucket)
        }
      }
    }
  });
  stack.addOutputs({
    DaynamoDBTableArn: notionPagesTable.tableArn,
    NotionBucketArn: notionBucket.bucketArn,
    DistributionId: distribution.cdk.distribution.distributionId
  });
  return {
    notionPagesTable,
    notionBucket
  };
}
__name(personalSiteData, "personalSiteData");

// stacks/personalSite.ts
import {
  CacheCookieBehavior,
  CacheHeaderBehavior,
  CachePolicy,
  CacheQueryStringBehavior
} from "aws-cdk-lib/aws-cloudfront";
import { ManagedPolicy } from "aws-cdk-lib/aws-iam";
import { LayerVersion } from "aws-cdk-lib/aws-lambda";
import { Duration as CdkDuration } from "aws-cdk-lib/core";
import { Bucket as Bucket3, Config as Config2, NextjsSite, use as use4 } from "sst/constructs";
function personalSite({ stack }) {
  const STRIPE_KEY = new Config2.Secret(stack, "STRIPE_KEY");
  const myparam = new Config2.Parameter(stack, "myparam", {
    value: "myparamvalue"
  });
  const { siteDomain, staticDomain } = use4(allConfig);
  const { notionPagesTable, notionBucket } = use4(personalSiteData);
  const lambdaInsightsLayerName = "arn:aws:lambda:us-east-1:580247275435:layer:LambdaInsightsExtension-Arm64:16";
  const lambdaInsightsLayer = LayerVersion.fromLayerVersionArn(
    stack,
    "LambdaInsights",
    lambdaInsightsLayerName
  );
  const cloudFrontLogsBucket = new Bucket3(stack, "CloudFrontLogsBucket", {});
  const site = new NextjsSite(stack, "site", {
    bind: [notionPagesTable, notionBucket, myparam],
    path: "packages/web",
    warm: 2,
    // edge: true,
    customDomain: {
      domainName: siteDomain.value,
      domainAlias: `www.${siteDomain.value}`
      // alternateNames: [`www.${domainName}`]
    },
    logging: "per-route",
    imageOptimization: {
      memorySize: 1024
    },
    memorySize: 512,
    timeout: 5,
    cdk: {
      serverCachePolicy: new CachePolicy(stack, "ServerCache", {
        queryStringBehavior: CacheQueryStringBehavior.all(),
        headerBehavior: CacheHeaderBehavior.allowList(
          "accept",
          "rsc",
          "next-router-prefetch",
          "next-router-state-tree",
          "next-url"
        ),
        cookieBehavior: CacheCookieBehavior.none(),
        defaultTtl: CdkDuration.seconds(60),
        maxTtl: CdkDuration.days(1),
        minTtl: CdkDuration.seconds(60)
      }),
      distribution: {
        logBucket: cloudFrontLogsBucket.cdk.bucket,
        logFilePrefix: "cloudfront-nextjs-logs/"
      },
      transform: (args) => {
        const imageOptimizer = args.origins?.imageOptimizer;
        if (imageOptimizer.type === "function" || imageOptimizer.type === "image-optimization-function") {
          console.debug(
            "changing image optimizer function properties to include lambda insights layer"
          );
          const layers = imageOptimizer.function.layers || [];
          const funcProps = imageOptimizer.function;
          const newProps = {
            ...funcProps,
            layers: [...layers, lambdaInsightsLayer]
            // timeout: duration, // Trace: TypeError: props.timeout.toSeconds is not a function
          };
          imageOptimizer.function = newProps;
        }
        logger.success("cdk plan has been transformed");
        logger.debug("new cdk plan: ", args);
        return args;
      },
      server: {
        layers: [lambdaInsightsLayer]
      }
    }
  });
  site.cdk?.function?.role?.addManagedPolicy(
    ManagedPolicy.fromAwsManagedPolicyName(
      "CloudWatchLambdaInsightsExecutionRolePolicy"
    )
  );
  stack.addOutputs({
    SiteUrl: site.url,
    CustomUrl: `https://${siteDomain.value}/`
  });
}
__name(personalSite, "personalSite");

// sst.config.ts
var sst_config_default = {
  config(_input) {
    return {
      name: "iliazlobin",
      region: "us-east-1"
    };
  },
  stacks(app) {
    app.setDefaultFunctionProps({
      environment: {
        NODE_OPTIONS: "--enable-source-maps"
      },
      nodejs: {
        sourcemap: true
      }
    });
    app.stack(allConfig);
    app.stack(personalSiteData);
    app.stack(personalSite);
    app.stack(authorizer);
    app.stack(blogWorkflow);
  }
};
export {
  sst_config_default as default
};
