import { exportMarkdownPage } from '@iliazlobin/core/notion/controller'
import {
  exportPageToLocalDisk,
  getRootPageRecursively as retrievePageTreeRecursively,
} from '@iliazlobin/core/notion/notion-client/client'
import { listPosts, retrievePost } from '@iliazlobin/core/notion/service'

import fs from 'fs'
import { expect, it } from 'vitest'

it('export notion page to S3', async () => {
  // await exportMarkdownPage({
  //   pageId: '5d488cacdf6d411295dcb93f0d4080ec',
  // })
  await exportMarkdownPage({
    pageId: 'eb22bf1655ab4ad7ba36597915f67c66',
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
