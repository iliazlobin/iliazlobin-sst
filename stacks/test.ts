import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda'
import path from 'path'
import { StackContext } from 'sst/constructs'

export function TestStack({ stack }: StackContext) {
  const simpleFunction = new Function(stack, 'simpleFunction', {
    runtime: Runtime.NODEJS_18_X,
    handler: 'action.start',
    code: Code.fromAsset(
      path.join(__dirname, 'packages/functions/blog-summarizer'),
    ),
  })

  stack.addOutputs({
    simpleFunction: simpleFunction.functionArn,
  })
}
