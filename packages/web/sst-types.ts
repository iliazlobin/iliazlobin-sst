import "sst/node/config";
declare module "sst/node/config" {
  export interface ConfigTypes {
    APP: string;
    STAGE: string;
  }
}

import "sst/node/config";
declare module "sst/node/config" {
  export interface ParameterResources {
    "version": {
      value: string;
    }
  }
}

import "sst/node/config";
declare module "sst/node/config" {
  export interface ParameterResources {
    "siteDomain": {
      value: string;
    }
  }
}

import "sst/node/config";
declare module "sst/node/config" {
  export interface ParameterResources {
    "staticDomain": {
      value: string;
    }
  }
}

import "sst/node/config";
declare module "sst/node/config" {
  export interface SecretResources {
    "apifyBlogProcessToken": {
      value: string;
    }
  }
}

import "sst/node/config";
declare module "sst/node/config" {
  export interface SecretResources {
    "apifyToken": {
      value: string;
    }
  }
}

import "sst/node/config";
declare module "sst/node/config" {
  export interface SecretResources {
    "notionToken": {
      value: string;
    }
  }
}

import "sst/node/config";
declare module "sst/node/config" {
  export interface ParameterResources {
    "blogSummarizerNotionDatabase": {
      value: string;
    }
  }
}

import "sst/node/config";
declare module "sst/node/config" {
  export interface SecretResources {
    "openaiApiKey": {
      value: string;
    }
  }
}

import "sst/node/config";
declare module "sst/node/config" {
  export interface ParameterResources {
    "openaiModel": {
      value: string;
    }
  }
}

import "sst/node/table";
declare module "sst/node/table" {
  export interface TableResources {
    "NotionPages": {
      tableName: string;
    }
  }
}

import "sst/node/bucket";
declare module "sst/node/bucket" {
  export interface BucketResources {
    "NotionBucket": {
      bucketName: string;
    }
  }
}

import "sst/node/config";
declare module "sst/node/config" {
  export interface SecretResources {
    "STRIPE_KEY": {
      value: string;
    }
  }
}

import "sst/node/config";
declare module "sst/node/config" {
  export interface ParameterResources {
    "myparam": {
      value: string;
    }
  }
}

import "sst/node/bucket";
declare module "sst/node/bucket" {
  export interface BucketResources {
    "CloudFrontLogsBucket": {
      bucketName: string;
    }
  }
}

import "sst/node/site";
declare module "sst/node/site" {
  export interface NextjsSiteResources {
    "site": {
      url: string;
    }
  }
}

import "sst/node/table";
declare module "sst/node/table" {
  export interface TableResources {
    "authorizationTokens": {
      tableName: string;
    }
  }
}

import "sst/node/function";
declare module "sst/node/function" {
  export interface FunctionResources {
    "authorizerFunction": {
      functionName: string;
    }
  }
}

import "sst/node/function";
declare module "sst/node/function" {
  export interface FunctionResources {
    "summarizeDocumentFunction": {
      functionName: string;
    }
  }
}

import "sst/node/function";
declare module "sst/node/function" {
  export interface FunctionResources {
    "saveDocumentFunction": {
      functionName: string;
    }
  }
}

import "sst/node/function";
declare module "sst/node/function" {
  export interface FunctionResources {
    "retrieveItemTextFunction": {
      functionName: string;
    }
  }
}

import "sst/node/function";
declare module "sst/node/function" {
  export interface FunctionResources {
    "checkDocumentExistFunction": {
      functionName: string;
    }
  }
}

import "sst/node/function";
declare module "sst/node/function" {
  export interface FunctionResources {
    "retrieveItemsFunction": {
      functionName: string;
    }
  }
}

