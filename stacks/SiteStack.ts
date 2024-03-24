import { DataStack } from '@/stacks/DataStack'

import { SSTConfig } from 'sst'
import { StackContext } from 'sst/constructs'
import { NextjsSite, use } from 'sst/constructs'

export function SiteStack({ stack }: StackContext) {
  const originalDomainName = 'iliazlobin.com'
  const domainName =
    stack.stage === 'prod'
      ? originalDomainName
      : `${stack.stage}.${originalDomainName}`

  // const zone = route53.HostedZone.fromLookup(stack, 'Zone', {
  //   domainName: domainName
  // })

  // const certificate = new acm.Certificate(stack, 'SiteCertificate', {
  //   domainName: domainName,
  //   validation: acm.CertificateValidation.fromDns(zone)
  // })

  // const { notionTable } = use(DataStack)

  const site = new NextjsSite(stack, 'site', {
    // bind: [notionTable],
    path: 'packages/web',
    // edge: true,
    customDomain: {
      domainName: domainName,
      domainAlias: `www.${domainName}`,
      // alternateNames: [`www.${domainName}`]
    },
    logging: 'per-route',
    imageOptimization: {
      memorySize: 128,
    },
  })

  stack.addOutputs({
    SiteUrl: site.url,
    CustomUrl: `https://${domainName}/`,
  })
}
