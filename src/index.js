import { organizeImports } from './organize-imports'
// @ts-ignore
import { loadPlugins } from './plugins.js'

let base = await loadPlugins()

/** @type {Partial<import('prettier').SupportLanguage>[]} */
export const languages = [
  {
    name: 'astro',
    parsers: ['astro'],
    extensions: ['.astro'],
    vscodeLanguageIds: ['astro'],
  },
]

/**
 * @param {string} parserFormat
 */
function createParser(parserFormat) {
  return base.parsers[parserFormat]
    ? {
        ...base.parsers[parserFormat],
        preprocess(code, options) {
          return organizeImports(
            base.parsers[parserFormat].preprocess
              ? base.parsers[parserFormat].preprocess(code, options)
              : code,
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
      }
}

export { options } from './options.js'

export const printers = {
  astro: {
    ...(base.printers.astro
      ? base.printers.astro
      : {
          print(path) {
            const node = path.getValue()

            if (typeof node === 'string') {
              return node
            }

            return node.value
          },
        }),
  },
}

export const parsers = {
  ...(base.parsers.astro
    ? {
        astro: createParser('astro'),
      }
    : {}),
}
