import axios from 'axios';
import { it } from 'vitest'
import fs from 'fs'

it.only('start machine', async () => {
  const payload = fs.readFileSync(`${__dirname}/files/failing_aws_apify_payload.json`, 'utf-8')
  const data = JSON.parse(payload)
  const response = await axios.post('https://tqnqj3hg8b.execute-api.us-east-1.amazonaws.com/start-machine', data)
  console.log(response.data)
})
