import BlogList from '@iliazlobin/web/components/BlogList'
import { getWebPosts } from '@iliazlobin/web/service/post'
import '@iliazlobin/web/styles/mdx.css'

// export const config: ConfigTypes = {
//   APP: 'web',
//   STAGE: 'dev',
// }
// export const version: ParameterResources = {
//   version: {
//     value: '1.0',
//   },
// }
// console.log(version)
// console.log(Config.version.value)
// import { Config3, ParameterResources3 } from './decl'
// import {
//   Config,
//   ConfigTypes,
//   ParameterTypes,
//   SecretTypes,
// } from 'sst/node/config'
// const value: ConfigTypes & ParameterTypes & SecretTypes = {
//   configValue: 'config',
//   parameterValue: 123,
//   parameterValue2: 123,
//   secretValue: true,
// }
// const person: ConfigTypes = {
//   age2: 10,
//   name: 'John',
// }
// console.log(Config.siteDomain)
// import { Bucket } from 'sst/node/bucket'
import { Table } from 'sst/node/table'

const tableName = Table.NotionPages.tableName
// const bucketName = Bucket.NotionBucket.bucketName

export default async function PostsPage() {
  const posts = await getWebPosts()

  return <BlogList posts={posts} />
}
