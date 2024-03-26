import { exportMarkdownPage } from '@/notion/controller'
import {
  exportPageToLocalDisk,
  getRootPageRecursively as retrievePageTreeRecursively,
} from '@/notion/notion-client/client'
import { listPosts, retrievePost } from '@/notion/service'

import fs from 'fs'
import { expect, it } from 'vitest'

it.only('export notion page to S3', async () => {
  // await exportMarkdownPage({
  //   pageId: '5d488cacdf6d411295dcb93f0d4080ec',
  // })
  await exportMarkdownPage({
    pageId: '965854d95e80436cb6bc631965eb0fc2',
  })
  console.log('done')
})

it('list posts', async () => {
  const posts = await listPosts()
  expect(posts).toBeDefined()
})

it('retrieve post', async () => {
  const post = await retrievePost({
    pageId: '5d488cacdf6d411295dcb93f0d4080ec',
  })
  expect(post).toBeDefined()
})

it.skip('notion client: export page', async () => {
  const pageFile = await exportPageToLocalDisk({
    pageId: '5d488cacdf6d411295dcb93f0d4080ec',
    pageName: 'page',
    exportDirectory: 'files',
  })

  const fileExists = fs.existsSync(pageFile)
  expect(fileExists).toBe(true)
})

it.skip('notion client: get page hierearchy', async () => {
  const result = await retrievePageTreeRecursively({
    pageId: '0fd7aac70c6f47e8805132301dbd2cef', // Tech
  })

  expect(result).toBe(true)
})
