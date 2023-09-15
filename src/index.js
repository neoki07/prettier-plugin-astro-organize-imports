import { organizeImports } from './organize-imports'
import { getAstroParser, getAstroPrinter } from './plugins.js'

const parser = await getAstroParser()
const printer = await getAstroPrinter()

/**
 * @param {string} parserFormat
 */

export { options } from './options.js'

export const printers = {
  astro: printer
    ? printer
    : {
        print(path) {
          const node = path.getValue()

          if (typeof node === 'string') {
            return node
          }

          return node.value
        },
      },
}

export const parsers = {
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
