import axios from 'axios'
import { time } from "console"
import fs from 'fs'
import { Config } from 'sst/node/config'
import { it } from 'vitest'

it('process blog', async () => {
  const payload = fs.readFileSync(
    `${__dirname}/files/failing_aws_apify_payload.json`,
    'utf-8',
  )
  const data = JSON.parse(payload)

  const token = Config.apifyBlogProcessToken

  const response = await axios.post(
    'https://tqnqj3hg8b.execute-api.us-east-1.amazonaws.com/blog/process', // dev
    // 'https://cdmujzau4j.execute-api.us-east-1.amazonaws.com/blog/process', // prod
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 3000,
    },
  )

  console.log(response.data)
})
