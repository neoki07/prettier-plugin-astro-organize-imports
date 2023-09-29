import { createRequire as req } from 'module'
import { resolveConfig } from 'prettier'

const plugins = ['prettier-plugin-astro', 'prettier-plugin-tailwindcss']

async function loadConfig() {
  return await resolveConfig(process.cwd())
}

async function loadIfExistsESM(name: string) {
  try {
    if (req(import.meta.url).resolve(name)) {
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

function isPluginEnabled(name: string, options: any) {
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
    if (plugin?.parsers?.astro) {
      parser = plugin.parsers.astro
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

    if (plugin?.printers?.astro) {
      printer = plugin.printers.astro
    }
  }

  return printer
}
