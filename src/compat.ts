import type { Options, Parser, Plugin } from 'prettier';
import { loadIfExists } from './utils';

export const compatiblePlugins = ['prettier-plugin-tailwindcss'];
export const additionalParserPlugins = ['prettier-plugin-astro'];

const parserMap = new Map<string, any>()
const isTesting = process.env.NODE_ENV === 'test'

export function getCompatibleParser(base: any, parserFormat: any, options: any) {
  if (parserMap.has(parserFormat) && !isTesting) {
    return parserMap.get(parserFormat)
  }

  const parser = getFreshCompatibleParser(base, parserFormat, options)
  parserMap.set(parserFormat, parser)
  return parser
}

function getFreshCompatibleParser(base: any, parserFormat: string, options: Options): Parser<any> {
  if (!options.plugins) {
    return base.parsers[parserFormat]
  }

  const parser = {
    ...base.parsers[parserFormat],
  }

  // Now load parsers from plugins
  for (const name of compatiblePlugins) {
    const plugin = findEnabledPlugin(options, name)

    if (plugin) {
      Object.assign(parser, plugin.parsers?.[parserFormat])
    }
  }

  return parser
}

export function getAdditionalParsers(): Record<string, Parser<any>> {
  const parsers = {}

  for (const pkg of additionalParserPlugins) {
    Object.assign(parsers, loadIfExists(pkg)?.parsers ?? {})
  }

  return parsers
}


function findEnabledPlugin(options: Options, name: string): Plugin<any> | undefined {
  if (options.plugins === undefined) {
    throw new Error('options.plugins is undefined')
  }

  let path: string | undefined = undefined

  try {
    path = require.resolve(name)
  } catch (err) {
    return undefined
  }

  const plugin = options.plugins.find(
    (p: any) => p.name === name || p.name === path,
  ) as Plugin<any>

  // The plugin was found by name or path
  if (plugin) {
    return plugin
  }

  // The plugin was loaded with require so we use object equality to find it
  const mod = loadIfExists(path)
  if (mod && mod.parsers && options.plugins.includes(mod)) {
    return mod
  }

  return undefined
}