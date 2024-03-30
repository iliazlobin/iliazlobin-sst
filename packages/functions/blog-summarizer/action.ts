import { ApiHandler } from 'sst/node/api'

export const start = ApiHandler(async _evt => {
  console.log('start')

  return {
    statusCode: 200,
    body: 'Started',
  }
})
