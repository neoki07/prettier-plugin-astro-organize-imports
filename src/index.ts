import prettier from 'prettier'
import ts from 'typescript'
import { organizeImports } from './organize-imports'
import { getAstroParser, getAstroPrinter } from './plugins'

const parser = await getAstroParser()
const printer = await getAstroPrinter()

export interface PluginOptions {
  astroOrganizeImportsMode: ts.OrganizeImportsMode
}

declare module 'prettier' {
  interface RequiredOptions extends PluginOptions {}
  interface ParserOptions extends PluginOptions {}
}

export const parsers: Record<string, prettier.Parser> = {
  astro: parser
    ? {
        ...parser,
        preprocess(code, options) {
          return organizeImports(
            parser.preprocess ? parser.preprocess(code, options) : code,
            options.astroOrganizeImportsMode,
          )
        },
      }
    : {
        parse(code) {
          return code
        },
        astFormat: 'astro',
        locStart(node) {
          return node.position.start.offset
        },
        locEnd(node) {
          return node.position.end.offset
        },
        preprocess(code, options) {
          return organizeImports(code, options.astroOrganizeImportsMode)
        },
      },
}

export const printers: Record<string, prettier.Printer> = {
  astro: printer
    ? printer
    : {
        print(path) {
          const { node } = path

          if (typeof node === 'string') {
            return node
          }

          return node.value
        },
      },
}

const modeOption: prettier.ChoiceSupportOption<ts.OrganizeImportsMode> = {
  type: 'choice',
  default: ts.OrganizeImportsMode.All,
  category: 'OrganizeImports',
  description: 'Organize imports mode',
  choices: [
    {
      value: ts.OrganizeImportsMode.All,
      description:
        'Removing unused imports, coalescing imports from the same module, and sorting imports',
    },
    {
      value: ts.OrganizeImportsMode.SortAndCombine,
      description: 'Coalesce imports from the same module and sorting imports',
    },
    {
      value: ts.OrganizeImportsMode.RemoveUnused,
      description: 'Removing unused imports',
    },
  ],
}

export const options: Record<keyof PluginOptions, prettier.SupportOption> = {
  astroOrganizeImportsMode: modeOption,
}
