# Prettier Plugin: Organize Imports for Astro

A plugin that makes Prettier organize your imports (i. e. sorts, combines and removes unused ones) in Astro files using the `organizeImports` feature of the TypeScript language service API.

## Installation

```shell
npm install -D prettier typescript prettier-plugin-astro-organize-imports
```

### Recommended configuration

```json5
{
  "plugins": ["prettier-plugin-astro-organize-imports"],
  "overrides": [
    {
      "files": "*.astro",
      "options": {
        "parser": "astro"
      }
    }
  ]
}
```

## Compatibility with other Prettier plugins

This plugin uses Prettier APIs that can only be used by one plugin at a time, making it incompatible with other Prettier plugins implemented the same way. To solve this we've added explicit per-plugin workarounds that enable compatibility with the following Prettier plugins:

- prettier-plugin-astro
- prettier-plugin-tailwindcss

One limitation with this approach is that `prettier-plugin-astro-organize-imports` must be loaded last, meaning Prettier auto-loading needs to be disabled. You can do this by setting the `pluginSearchDirs` option to `false` and then listing each of your Prettier plugins in the `plugins` array:

```json5
// .prettierrc
{
  // ..
  "plugins": [
    "prettier-plugin-astro",
    "prettier-plugin-tailwindcss",
    "prettier-plugin-astro-organize-imports" // MUST come last
  ],
  "pluginSearchDirs": false
}
```

## Related Prettier plugins

This plugin is heavily inspired by following plugins:

- [prettier-plugin-organize-imports](https://github.com/simonhaenisch/prettier-plugin-organize-imports)

And, for implementation reference, the following plugins:

- [prettier-plugin-astro](https://github.com/withastro/prettier-plugin-astro)
- [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)
