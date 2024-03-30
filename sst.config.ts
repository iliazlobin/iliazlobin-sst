import { ApiStack } from './stacks/ApiStack'
import { ConfigStack } from './stacks/ConfigStack'
import { DataStack } from './stacks/DataStack'
import { SiteStack } from './stacks/SiteStack'
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
    app.stack(ConfigStack)
    app.stack(ApiStack)
    // app.stack(DataStack)
    // app.stack(SiteStack)
  },
} satisfies SSTConfig
