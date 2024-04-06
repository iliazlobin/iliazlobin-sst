export interface Item {
  authors: string[]
  author?: string
  blog: string
  categories: string[]
  date: string
  tags: string[]
  tag?: string
  title: string
  url: string
  datasetId?: string
  cloud?: string
  text?: string
}

export interface ActorInfo {
  name: string
  username: string
  title?: string
}

export type Summary = {
  summary: string
  takeaways: string[]
  technologies: string[]
  stakeholders: string[]
}

export type Actor = {}
