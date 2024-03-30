import { allConfig } from './allConfig'
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins'
import { Bucket, Distribution, StackContext, Table, use } from 'sst/constructs'

export function siteData({ stack }: StackContext) {
  // const originalDomainName = 'iliazlobin.com'
  // const domainName =
  //   stack.stage === 'prod'
  //     ? originalDomainName
  //     : `${stack.stage}.${originalDomainName}`

  const { siteDomain, staticDomain } = use(allConfig)

  const notionPagesTable = new Table(stack, 'NotionPages', {
    fields: {
      pageId: 'string',
      // pageTitle: 'string',
    },
    // primaryIndex: { partitionKey: 'pageId', sortKey: 'pageTitle' },
    primaryIndex: { partitionKey: 'pageId' },
  })

  const notionBucket = new Bucket(stack, 'NotionBucket')

  const distribution = new Distribution(stack, 'NotionDistribution', {
    customDomain: staticDomain.value,
    cdk: {
      distribution: {
        comment: 'Static assets for a website',
        defaultBehavior: {
          // viewerProtocolPolicy: ViewerProtocolPolicy.HTTPS_ONLY,
          // allowedMethods: AllowedMethods.ALLOW_ALL,
          origin: new S3Origin(notionBucket.cdk.bucket),
        },
      },
    },
  })

  stack.addOutputs({
    DaynamoDBTableArn: notionPagesTable.tableArn,
    NotionBucketArn: notionBucket.bucketArn,
    DistributionId: distribution.cdk.distribution.distributionId,
  })

  return {
    notionTable: notionPagesTable,
    notionBucket,
  }
}
