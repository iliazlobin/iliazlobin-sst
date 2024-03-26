import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins'
import { Bucket, Distribution, StackContext, Table } from 'sst/constructs'

// // import { Bucket } from 'sst/constructs'
// import { StackContext, Table } from 'sst/constructs'
// // import { Distribution } from 'sst/constructs/Distribution'
// import { Bucket } from 'sst/constructs/Bucket'

export function DataStack({ stack }: StackContext) {
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
    customDomain: 'static.iliazlobin.com',
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
