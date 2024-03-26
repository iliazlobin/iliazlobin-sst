import fs from 'node:fs/promises'
import {compile} from '@mdx-js/mdx'
import remarkGfm from 'remark-gfm'

const exampleFile = '/home/izlobin/ws/iliazlobin-sst/packages/web/test/example.mdx'

console.log(
  String(
    await compile(await fs.readFile(exampleFile), {remarkPlugins: [remarkGfm]})
  )
)
