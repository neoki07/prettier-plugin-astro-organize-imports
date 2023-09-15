import { Parser, Printer, SupportOption } from 'prettier';

export interface PluginOptions {}

declare module 'prettier' {
  interface RequiredOptions extends PluginOptions {}
  interface ParserOptions extends PluginOptions {}
}

export const options: Record<keyof PluginOptions, SupportOption>
export const parsers: Record<string, Parser>
export const printers: Record<string, Printer>
