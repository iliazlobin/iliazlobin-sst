import 'sst/node/config'

declare namespace NodeJS {
  export interface ProcessEnv {
    ACCESS_TOKEN: string
    SESSION_TOKEN: string
    ENVRIONMENT: 'development' | 'production'
  }
}

// declare module './decl' {
// declare namespace myns {
// declare module 'sst/node/config' {
//   export interface ParameterResources {
//     version: {
//       value: string
//     }
//   }
// }

declare module 'sst/node/config' {
  export interface Person {
    age: number
    name: string
  }
}
