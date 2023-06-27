// @ts-check
import {
  getCompatibleParser,
  getAdditionalParsers,
} from './compat.js'
import { organizeImports } from './organize-imports.js'

let base = getBasePlugins()

/**
 * @param {string} parserFormat
 */
function createParser(parserFormat) {
  return {
    ...base.parsers[parserFormat],
    preprocess(code, options) {
      let original = getCompatibleParser(base, parserFormat, options)
			return organizeImports(original.preprocess ? original.preprocess(code, options) : code, options);
    },

    /**
     *
     * @param {string} text
     * @param {any} parsers
     * @param {import('prettier').ParserOptions} options
     * @returns
     */
    parse(text, parsers, options = {}) {
      let original = getCompatibleParser(base, parserFormat, options)
      return original.parse(text, parsers, options)
    },
  }
}

export const parsers = {
  ...(base.parsers.astro
    ? {
        astro: createParser('astro'),
      }
    : {}),
}

/**
 *
 * @returns {{parsers: Record<string, import('prettier').Parser<any>>}}
 */
function getBasePlugins() {
  return {
    parsers: {
      ...getAdditionalParsers(),
    },
  }
}
