// export interface TableResources {
//   NotionPages: {
//     tableName: string
//   }
// }
import 'sst/node/table'

declare module 'sst/node/table' {
  export interface TableResources {
    NotionPages: {
      tableName: string
    }
  }
}

export interface TableResources {}
export declare const Table: TableResources
