import { createRequire as req } from 'module'
import type { Options, Parser, ParserOptions, Plugin, Printer } from 'prettier'

const basePlugin = 'prettier-plugin-astro'

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

export async function loadPlugin() {
  const base = await loadBasePlugins()
  const compatible = await loadCompatiblePlugins()

  const baseParser = { ...base.parsers.astro }

  function maybeResolve(name: string) {
    try {
      return req.resolve(name)
    } catch (err) {
      return null
    }
  }

  function findEnabledPlugin(
    options: ParserOptions | Options,
    name: string,
    mod: Plugin,
  ) {
    if (!options.plugins) {
      throw new Error(`options.plugins is not defined`)
    }

    let path = maybeResolve(name)

    for (let plugin of options.plugins) {
      if (typeof plugin === 'string') {
        throw new Error(
          `Plugin must be \`prettier.Plugin\`. but got \`string\`: ${plugin}`,
        )
      }

      // options.plugins.*.name == name
      if (plugin.name === name) {
        return mod
      }

      // options.plugins.*.name == path
      if (plugin.name === path) {
        return mod
      }

      // basically options.plugins.* == mod
      // But that can't work because prettier normalizes plugins which destroys top-level object identity
      if (plugin.parsers && mod.parsers && plugin.parsers == mod.parsers) {
        return mod
      }
    }

    return null
  }

  return {
    parser: baseParser,

    originalParser(options: Options): Partial<Parser> {
      if (!options.plugins) {
        return {}
      }

      let parser = {}

      // Now load parsers from "compatible" plugins if any
      for (const { name, mod } of compatible) {
        let plugin = findEnabledPlugin(options, name, mod)
        if (plugin) {
          Object.assign(parser, plugin.parsers?.astro)
        }
      }

      return parser
    },

    originalPrinter(options: Options): Partial<Printer> {
      if (!options.plugins) {
        return {}
      }

      let parser = {}

      for (const { name, mod } of compatible) {
        let plugin = findEnabledPlugin(options, name, mod)
        if (plugin) {
          Object.assign(parser, plugin.printers?.astro)
        }
      }

      return parser
    },
  }
}

async function loadBasePlugins() {
  return await loadIfExistsESM(basePlugin)
}

async function loadCompatiblePlugins() {
  const plugins = [basePlugin, 'prettier-plugin-tailwindcss']

  return await Promise.all(
    plugins.map(async (name) => {
      let mod = await loadIfExistsESM(name)

      return {
        name,
        mod,
      }
    }),
  )
}
