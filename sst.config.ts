import { allConfig } from './stacks/allConfig'
import { authorizer } from './stacks/authorizer'
import { blogWorkflow } from './stacks/blogWorkflow'
import { personalSite } from './stacks/personalSite'
import { personalSiteData } from './stacks/personalSiteData'
import { publicHttpApi } from './stacks/publicHttpApi'
import { SSTConfig } from 'sst'

export default {
  config(_input: any) {
    return {
      name: 'iliazlobin',
      region: 'us-east-1',
    }
  },
  stacks(app: any) {
    // logger.info('highlight')
    // logger.error('error')
    // logger.warning('warning')
    // logger.success('success')
    // logger.debug('debug')
    // logger.trace('data')

    app.setDefaultFunctionProps({
      environment: {
        NODE_OPTIONS: '--enable-source-maps',
      },
      nodejs: {
        sourcemap: true,
      },
    })

    app.stack(allConfig)

    // app.stack(TestStack)

    // app.stack(personalSiteData)
    // app.stack(personalSite)

    app.stack(authorizer)
    app.stack(blogWorkflow)
    app.stack(publicHttpApi)
  },
} satisfies SSTConfig
