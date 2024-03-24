
import { MdBlock } from 'notion-to-md/build/types'

export type PageDetails = {
  id: string
  title: string
  coverImageUrl: string
  createdTime: string
  lastEditedTime: string
  blocks: MdBlock[]
}

export type BlockImage = {
  name: string
  url: string
}

export type NotionPage = {
  id: string
  title: string
  createdTime: string
  lastEditedTime: string
  childPages?: NotionPage[]
}
