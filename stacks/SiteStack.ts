import { ConfigStack } from './ConfigStack'
import { logger } from './logger'
import {
  CacheCookieBehavior,
  CacheHeaderBehavior,
  CachePolicy,
  CacheQueryStringBehavior,
} from 'aws-cdk-lib/aws-cloudfront'
import { ManagedPolicy } from 'aws-cdk-lib/aws-iam'
import { LayerVersion } from 'aws-cdk-lib/aws-lambda'
import { IBucket } from 'aws-cdk-lib/aws-s3'
import { Duration as CdkDuration } from 'aws-cdk-lib/core'
import { Bucket, NextjsSite, StackContext, use } from 'sst/constructs'
import { Duration, Function } from 'sst/constructs'
import { SsrFunction, SsrFunctionProps } from 'sst/constructs/SsrFunction'
import { Plan } from 'sst/constructs/SsrSite'

export function SiteStack({ stack }: StackContext) {
  // const originalDomainName = 'iliazlobin.com'
  // const domainName =
  //   stack.stage === 'prod'
  //     ? originalDomainName
  //     : `${stack.stage}.${originalDomainName}`

  // const zone = route53.HostedZone.fromLookup(stack, 'Zone', {
  //   domainName: domainName
  // })

  // const certificate = new acm.Certificate(stack, 'SiteCertificate', {
  //   domainName: domainName,
  //   validation: acm.CertificateValidation.fromDns(zone)
  // })

  const { siteDomain, staticDomain } = use(ConfigStack)
  const lambdaInsightsLayerName =
    'arn:aws:lambda:us-east-1:580247275435:layer:LambdaInsightsExtension-Arm64:16'
  const lambdaInsightsLayer = LayerVersion.fromLayerVersionArn(
    stack,
    'LambdaInsights',
    lambdaInsightsLayerName,
  )

  const cloudFrontLogsBucket = new Bucket(stack, 'CloudFrontLogsBucket', {})

  const site = new NextjsSite(stack, 'site', {
    // bind: [notionTable],
    path: 'packages/web',
    // edge: true,
    customDomain: {
      domainName: siteDomain.value,
      domainAlias: `www.${siteDomain.value}`,
      // alternateNames: [`www.${domainName}`]
    },
    logging: 'per-route',
    imageOptimization: {
      memorySize: 1024,
    },
    memorySize: 512,
    timeout: 5,
    cdk: {
      serverCachePolicy: new CachePolicy(stack, 'ServerCache', {
        queryStringBehavior: CacheQueryStringBehavior.all(),
        headerBehavior: CacheHeaderBehavior.allowList(
          'accept',
          'rsc',
          'next-router-prefetch',
          'next-router-state-tree',
          'next-url',
        ),
        cookieBehavior: CacheCookieBehavior.none(),
        defaultTtl: CdkDuration.seconds(60),
        maxTtl: CdkDuration.days(1),
        minTtl: CdkDuration.seconds(60),
      }),
      distribution: {
        logBucket: cloudFrontLogsBucket.cdk.bucket,
        logFilePrefix: 'cloudfront-nextjs-logs/',
      },
      transform: (args: Plan) => {
        // logger.info('transforming cdk plan: ', args)
        const imageOptimizer = args.origins?.imageOptimizer
        // logger.debug('imageOptimizer: ', imageOptimizer)
        if (
          imageOptimizer.type === 'function' ||
          imageOptimizer.type === 'image-optimization-function'
        ) {
          console.debug(
            'changing image optimizer function properties to include lambda insights layer',
          )
          const layers = imageOptimizer.function.layers || []
          const funcProps = imageOptimizer.function as SsrFunctionProps

          // logger.debug('funcProps.timeout: ', funcProps.timeout) // undefined
          // const duration: Duration = '10 seconds'

          const newProps = {
            ...funcProps,
            layers: [...layers, lambdaInsightsLayer],
            // timeout: duration, // Trace: TypeError: props.timeout.toSeconds is not a function
          }
          imageOptimizer.function = newProps
        }
        logger.success('cdk plan has been transformed')
        logger.debug('new cdk plan: ', args)
        return args
      },
      server: {
        layers: [lambdaInsightsLayer],
      },
    },
  })

  site.cdk?.function?.role?.addManagedPolicy(
    ManagedPolicy.fromAwsManagedPolicyName(
      'CloudWatchLambdaInsightsExecutionRolePolicy',
    ),
  )

  stack.addOutputs({
    SiteUrl: site.url,
    CustomUrl: `https://${siteDomain.value}/`,
  })
}
