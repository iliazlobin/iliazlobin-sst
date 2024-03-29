import colors from 'colors'
import { Writable } from 'stream'
import * as util from 'util'

const { stdout, stderr } = process
type StyleFn = (str: string) => string

export class Logger {
  protected isVerbose = true

  private static instance: Logger

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  private log =
    (stream: Writable, styles?: StyleFn[]) =>
    (fmt: string, ...args: any[]) => {
      let str = util.format(fmt, ...args)
      if (styles && styles.length) {
        str = styles.reduce((a, style) => style(a), str)
      }
      stream.write(str + '\n')
    }
  private _debug = this.log(stderr, [colors.gray])

  public debug = (fmt: string, ...args: any[]) =>
    this.isVerbose && this._debug(fmt, ...args)
  public error = this.log(stderr, [colors.red])
  public warning = this.log(stderr, [colors.yellow])
  public success = this.log(stderr, [colors.green])
  public info = this.log(stderr, [colors.bold])
  public print = this.log(stderr)
  public trace = this.log(stdout)
}

export const logger = Logger.getInstance()
