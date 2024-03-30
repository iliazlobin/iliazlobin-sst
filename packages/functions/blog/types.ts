export interface Item {
  authors: string[]
  blog: string
  categories: string[]
  date: string
  tags: string[]
  text: string
  title: string
  url: string
}

export type Summary = {
  summary: string
  takeaways: string[]
  technologies: string[]
  stakeholders: string[]
}
