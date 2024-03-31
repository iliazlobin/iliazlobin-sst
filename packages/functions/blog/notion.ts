import { Client } from '@notionhq/client'
import {
  CreatePageParameters,
  QueryDatabaseParameters,
} from '@notionhq/client/build/src/api-endpoints'

import { Item, Summary } from './types'
import { Config } from 'sst/node/config'
import moment from "moment"

const notion = new Client({
  auth: Config.notionToken,
})

export async function findDocumentByUrl({
  url,
}: {
  url: string
}): Promise<any> {
  const query: QueryDatabaseParameters = {
    database_id: Config.blogSummarizerNotionDatabase,
    filter: {
      property: 'Url',
      url: { equals: url },
    },
  }

  const response = await notion.databases.query(query)
  console.log(`[DEBUG] len(results): ${response.results.length}`)
  console.log(`[DEBUG] results: ${response.results}`)

  return response.results
}

export async function upsertDocumentIntoDatabase({
  item,
  summary,
}: {
  item: Item
  summary: Summary
}): Promise<any> {
  const databaseId = Config.blogSummarizerNotionDatabase
  const cloud = item.cloud

  const takeawaysStr = summary.takeaways.join('\n')
  const categoriesDict = item.categories
    ? item.categories.map((category: string) => ({ name: category }))
    : []
  const tagsDict = item.tags
    ? item.tags.map((tag: string) => ({ name: tag }))
    : []
  const technologiesDict = summary.technologies.map((technology: string) => ({
    name: technology,
  }))
  const stakeholdersDict = summary.stakeholders.map((stakeholder: string) => ({
    name: stakeholder,
  }))
  const authorsStr = item.authors.join('\n')
  const isoDate = moment(item.date, 'MM/DD/YYYY').format('YYYY-MM-DD');

  const entry: CreatePageParameters = {
    parent: { database_id: databaseId },
    properties: {
      Url: { url: item.url },
      Cloud: { select: { name: cloud } },
      Title: { title: [{ text: { content: item.title } }] },
      Date: { date: { start: isoDate } },
      Summary: { rich_text: [{ text: { content: summary.summary } }] },
      Takeaways: { rich_text: [{ text: { content: takeawaysStr } }] },
      Blog: { select: { name: item.blog } },
      Technologies: { multi_select: technologiesDict },
      Stakeholders: { multi_select: stakeholdersDict },
      Authors: { rich_text: [{ text: { content: authorsStr } }] },
    },
  }

  if (categoriesDict.length) {
    entry.properties.Categories = { multi_select: categoriesDict }
  }

  if (tagsDict.length) {
    entry.properties.Tags = { multi_select: tagsDict }
  }

  const result = await notion.pages.create(entry)
  // const createdTime = result.object
  // console.log(`[DEBUG] created_time: ${createdTime}`)

  return {
    documentId: result.id,
  }
}
