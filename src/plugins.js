import { createRequire as req } from 'module'

/**
 * @typedef {object} PluginDetails
 * @property {Record<string, import('prettier').Parser<any>>} parsers
 * @property {Record<string, import('prettier').Printer<any>>} printers
 */

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

export async function loadPlugins() {
  const thirdparty = await loadThirdPartyPlugins()
  const compatible = await loadCompatiblePlugins()

  let parsers = {
    ...thirdparty.parsers,
  }

  let printers = {
    ...thirdparty.printers,
  }

  function maybeResolve(name) {
    try {
      return req.resolve(name)
    } catch (err) {
      return null
    }
  }

  function findEnabledPlugin(options, name, mod) {
    let path = maybeResolve(name)

    for (let plugin of options.plugins) {
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
    parsers,
    printers,

    originalParser(format, options) {
      if (!options.plugins) {
        return parsers[format]
      }

      let parser = { ...parsers[format] }

      // Now load parsers from "compatible" plugins if any
      for (const { name, mod } of compatible) {
        let plugin = findEnabledPlugin(options, name, mod)
        if (plugin) {
          Object.assign(parser, plugin.parsers[format])
        }
      }

      return parser
    },
  }
}

/**
 * @returns {Promise<PluginDetails}>}
 */
async function loadThirdPartyPlugins() {
  // Commented out plugins do not currently work with Prettier v3.0
  let [astro] = await Promise.all([loadIfExistsESM('prettier-plugin-astro')])

  return {
    parsers: {
      ...astro.parsers,
    },
    printers: {
      ...astro.printers,
    },
  }
}

async function loadCompatiblePlugins() {
  // Commented out plugins do not currently work with Prettier v3.0
  let plugins = ['prettier-plugin-organize-imports']

  // Load all the available compatible plugins up front
  // These are wrapped in try/catch internally so failure doesn't cause issues
  // Technically we're executing these plugins though
  // Even if not enabled
  // There is, unfortunately, no way around this currently
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
