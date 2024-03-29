import { RootPage } from '@iliazlobin/web/notion/types'
import { Client } from '@notionhq/client'
import {
  BlockObjectResponse,
  ChildPageBlockObjectResponse,
  PageObjectResponse,
  PartialBlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints'

import { PageDetails } from './types'
import axios from 'axios'
import { assert } from 'console'
import fs from 'fs'
import { NotionToMarkdown } from 'notion-to-md'
import { MdBlock } from 'notion-to-md/build/types'
import path from 'path'
import { Config } from 'sst/node/config'

const notion = new Client({
  auth: Config.NOTION_TOKEN,
})

const n2m = new NotionToMarkdown({ notionClient: notion })

function isChildPageBlockObjectResponse(
  block: PartialBlockObjectResponse | BlockObjectResponse,
): block is ChildPageBlockObjectResponse {
  return (block as ChildPageBlockObjectResponse).type === 'child_page'
}

export async function getRootPageRecursively({
  pageId,
}: {
  pageId: string
}): Promise<RootPage> {
  const page = await getPage(pageId)
  const pageTitle = getPageTitle(page)
  const childBlocks = await notion.blocks.children.list({
    block_id: pageId,
  })

  const childPages: RootPage[] = []
  for (const childPage of childBlocks.results) {
    if (isChildPageBlockObjectResponse(childPage)) {
      const title = childPage.child_page.title
      const id = childPage.id
      const page = await getRootPageRecursively({ pageId: id })
      assert(id === page.id)
      assert(title === page.title)
      childPages.push(page)
    }
  }

  return {
    id: pageId,
    title: pageTitle,
    childPages,
  }
}

async function getPage(pageId: string) {
  return (await notion.pages.retrieve({
    page_id: pageId,
  })) as PageObjectResponse
}

function getPageTitle(rootPage: PageObjectResponse) {
  let pageTitle = ''
  if (rootPage?.properties !== undefined) {
    const title = rootPage.properties.title
    if (title?.type === 'title') {
      pageTitle = title.title[0]?.plain_text || ''
    }
  }
  return pageTitle
}

export async function getPageDetails({
  pageId,
}: {
  pageId: string
}): Promise<PageDetails> {
  const page = await getPage(pageId)
  const pageTitle = getPageTitle(page)

  const n2m = new NotionToMarkdown({ notionClient: notion })
  const blocks = await n2m.pageToMarkdown(pageId)

  let coverUrl = ''
  const cover = page.cover
  if (cover?.type === 'file') {
    coverUrl = cover.file.url
  }

  return {
    id: pageId,
    title: pageTitle,
    coverImageUrl: coverUrl,
    createdTime: page.created_time,
    lastEditedTime: page.last_edited_time,
    blocks,
  }
}

// export async function* retrieveBlocksImages({ blocks }: { blocks: MdBlock[] }) {
// }

export function* traverseImages({
  blocks,
  imagePrefix = 'image',
}: {
  blocks: MdBlock[]
  imagePrefix?: string
}): Generator<{
  count: number
  alt: string
  url: string
}> {
  let imageCount = 0
  for (const block of blocks) {
    if (block.type === 'image') {
      const allMatch = block.parent.match(/^!\[(.*?)\]\((.*?)\)/)
      if (allMatch) {
        const altMatch = allMatch[1]
        const urlMatch = allMatch[2]
        if (!altMatch || !urlMatch) {
          continue
        }
        yield {
          count: imageCount,
          alt: altMatch,
          url: urlMatch,
        }
        imageCount++
      }
    }
  }
}

export function generateMarkdownFromPageBlocks({
  pageBlocks,
  urlRewriter,
}: {
  pageBlocks: MdBlock[]
  urlRewriter: ({
    count,
    alt,
    url,
  }: {
    count: number
    alt: string
    url: string
  }) => { imageAlt: string; imageUrl: string }
}): string {
  let imageCount = 0
  for (const block of pageBlocks) {
    if (block.type === 'image') {
      const allMatch = block.parent.match(/^!\[(.*?)\]\((.*?)\)/)
      if (allMatch) {
        const altMatch = allMatch[1]
        const urlMatch = allMatch[2]
        if (!altMatch || !urlMatch) {
          continue
        }
        const { imageAlt, imageUrl } = urlRewriter({
          count: imageCount,
          alt: altMatch,
          url: urlMatch,
        })
        block.parent = `![${imageAlt}](${imageUrl})`
        imageCount++
      }
    }
  }

  return getPageContent({ pageBlocks: pageBlocks })
}

export async function exportPageToLocalDisk({
  pageId,
  pageName = 'page',
  exportDirectory = 'files',
}: {
  pageId: string
  pageName: string
  exportDirectory: string
}): Promise<string> {
  const pageBlocks = await n2m.pageToMarkdown(
    // 'BLOG-Test-LangChain-on-AWS-Step-Functions-5d488cacdf6d411295dcb93f0d4080ec',
    // '5d488cacdf6d411295dcb93f0d4080ec',
    pageId,
  )

  const pageDir = path.join(__dirname, `/${exportDirectory}`)
  const imageDir = path.join(pageDir, '/images')
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true })
  }

  let imageCount = 0
  for (const block of pageBlocks) {
    if (block.type === 'image') {
      const urlMatch = block.parent.match(/\((.*?)\)/)
      if (urlMatch) {
        const imageUrl = urlMatch[1]

        if (!imageUrl) {
          continue
        }

        const response = await axios.get(imageUrl, {
          responseType: 'arraybuffer',
        })

        const imageName = `image${imageCount.toString().padStart(2, '0')}.png`
        imageCount++

        const imagePath = path.join(
          __dirname,
          '/files/images',
          path.basename(imageName),
        )
        const relativeImagePath = path.join(
          './images',
          path.basename(imageName),
        )

        fs.writeFileSync(imagePath, response.data)
        block.parent = block.parent.replace(imageUrl, relativeImagePath)
      }
    }
  }

  const content = getPageContent({ pageBlocks: pageBlocks })

  const pageFile = path.join(pageDir, `${pageName}.md`)
  fs.writeFileSync(pageFile, content)

  return pageFile
}

export function getPageContent({
  pageBlocks,
}: {
  pageBlocks: MdBlock[]
}): string {
  const mdString = n2m.toMarkdownString(pageBlocks)
  const content = mdString.parent

  if (!content) {
    throw new Error('Export failed')
  }
  return content
}
