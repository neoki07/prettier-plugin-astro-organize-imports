import type { Parser } from 'prettier';
import { organizeImports } from './lib/organize-imports';
import { getCompatibleParser, getAdditionalParsers } from './compat'

const base = getBasePlugins()

function createParser(parserFormat: string) {
  return {
    ...base.parsers[parserFormat],
    preprocess(code: string, options: any) {
      const original = getCompatibleParser(base, parserFormat, options)

			return organizeImports(
				original.preprocess ? original.preprocess(code, options) : code,
				options
			)
    },

    parse(text: string, parsers: any, options = {}) {
      const original = getCompatibleParser(base, parserFormat, options)
      return original.parse(text, parsers, options)
    },
  }
}

export const parsers: Record<string, Parser> = {
	...(base.parsers.astro
    ? {
        astro: createParser('astro'),
      }
    : {}),
}

function getBasePlugins(): {parsers: Record<string, Parser<any>>} {
  return {
    parsers: {
      ...getAdditionalParsers(),
    },
  }
}