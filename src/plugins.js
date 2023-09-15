import { resolveConfig } from 'prettier'

/**
 * @typedef {object} PluginDetails
 * @property {Record<string, import('prettier').Parser<any>>} parsers
 * @property {Record<string, import('prettier').Printer<any>>} printers
 */

const plugins = ['prettier-plugin-astro', 'prettier-plugin-tailwindcss']

async function loadConfig() {
  return await resolveConfig(process.cwd())
}

/**
 * @returns {Promise<import('prettier').Plugin<any>>}
 */
async function loadIfExistsESM(name) {
  try {
    if (createRequire(import.meta.url).resolve(name)) {
      let mod = await import(name)
      return mod.default ?? mod
    }
  } catch (e) {
    return {
      parsers: {},
      printers: {},
    }
  }
}

function isPluginEnabled(name, options) {
  return options.plugins.includes(name)
}

export async function getAstroParser() {
  const options = await loadConfig()

  if (!options?.plugins) {
    return undefined
  }

  let parser = undefined
  // Now load parsers from plugins
  for (const name of plugins) {
    if (!isPluginEnabled(name, options)) {
      continue
    }

    const plugin = await loadIfExistsESM(name)
    if (plugin) {
      parser = plugin.parsers?.astro
    }
  }

  return parser
}

export async function getAstroPrinter() {
  const options = await loadConfig()

  if (!options?.plugins) {
    return undefined
  }

  let printer = undefined
  // Now load parsers from plugins
  for (const name of plugins) {
    if (!isPluginEnabled(name, options)) {
      continue
    }

    const plugin = await loadIfExistsESM(name)

    if (plugin) {
      printer = plugin.printers?.astro
    }
  }

  return printer
}
