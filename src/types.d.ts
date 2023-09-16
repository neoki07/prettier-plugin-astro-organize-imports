import { Printer } from 'prettier'

export interface InternalOptions {
  printer: Printer<any>
}

declare module 'prettier' {
  interface RequiredOptions extends InternalOptions {}
  interface ParserOptions extends InternalOptions {}
}
