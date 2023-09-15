import prettier from 'prettier'
import { organizeImports } from './organize-imports'
import { getAstroParser, getAstroPrinter } from './plugins'

const parser = await getAstroParser()
const printer = await getAstroPrinter()

export const parsers: Record<string, prettier.Parser> = {
  astro: parser
    ? {
        ...parser,
        preprocess(code, options) {
          return organizeImports(
            parser.preprocess ? parser.preprocess(code, options) : code,
            undefined,
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
        preprocess(code) {
          return organizeImports(code, undefined)
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

export const options: prettier.SupportOptions = {}
