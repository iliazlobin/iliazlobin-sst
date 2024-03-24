import { ApiStack } from '@/stacks/ApiStack'
import { ConfigStack } from '@/stacks/ConfigStack'
import { DataStack } from '@/stacks/DataStack'
// import { API } from '@/stacks/MyStack'
import { SiteStack } from '@/stacks/SiteStack'

import { SSTConfig } from 'sst'

export default {
  config(_input) {
    return {
      name: 'iliazlobin-standalone',
      region: 'us-east-1',
    }
  },
  stacks(app) {
    // app.stack(API)
    app.stack(ConfigStack)
    app.stack(DataStack)
    app.stack(ApiStack)
    app.stack(SiteStack)
  },
} satisfies SSTConfig
