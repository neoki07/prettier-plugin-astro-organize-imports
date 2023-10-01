# Prettier Plugin: Organize Imports for Astro

[![license](https://img.shields.io/npm/l/prettier-plugin-astro-organize-imports.svg)](https://github.com/resonance-box/prettier-plugin-astro-organize-imports/blob/main/LICENSE.md)
[![npm](https://img.shields.io/npm/v/prettier-plugin-astro-organize-imports.svg)](https://www.npmjs.com/package/prettier-plugin-astro-organize-imports)
[![npm downloads](https://img.shields.io/npm/dm/prettier-plugin-astro-organize-imports)](https://www.npmjs.com/package/prettier-plugin-astro-organize-imports)
[![ci](https://github.com/ot07/prettier-plugin-astro-organize-imports/actions/workflows/ci.yml/badge.svg)](https://github.com/ot07/prettier-plugin-astro-organize-imports/actions/workflows/ci.yml)

A plugin that makes Prettier organize your imports (i. e. sorts, combines and removes unused ones) in Astro files using the `organizeImports` feature of the TypeScript language service API.

## Installation

```shell
npm install -D prettier typescript prettier-plugin-astro-organize-imports
```

### Recommended configuration

```json5
// .prettierrc
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

## Usage

After following the steps in the 'Installation' section, the plugin will function when you run the Prettier formatting command.

Files containing the substring `// organize-imports-ignore` or `// tslint:disable:ordered-imports` will be skipped and won't be processed by this plugin.

The plugin provides an option named `astroOrganizeImportsMode` that lets you choose the mode of formatting. The available options are:

- `All`: This is the default option. It removes unused imports, coalesces imports from the same module, and sorts imports.
- `SortAndCombine`: This option coalesces imports from the same module and sorts imports.
- `RemoveUnused`: This option removes the unused imports.

You can specify the mode in your Prettier configuration file as follows:

```json5
// .prettierrc
{
  // ..
  "astroOrganizeImportsMode": "All" // or "SortAndCombine" or "RemoveUnused"
}
```

Remember to replace "All" with "SortAndCombine" or "RemoveUnused" depending on your preferences.

## Compatibility with other Prettier plugins

This plugin uses Prettier APIs that can only be used by one plugin at a time, making it incompatible with other Prettier plugins implemented the same way. To solve this we've added explicit per-plugin workarounds that enable compatibility with the following Prettier plugins:

- `prettier-plugin-astro`
- `prettier-plugin-tailwindcss`

One limitation with this approach is that `prettier-plugin-astro-organize-imports` must be loaded last. You can do this by listing each of your Prettier plugins in the `plugins` array:

```json5
// .prettierrc
{
  // ..
  "plugins": [
    "prettier-plugin-astro",
    "prettier-plugin-tailwindcss",
    "prettier-plugin-astro-organize-imports" // MUST come last
  ],
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

## Related Prettier plugins

This plugin is heavily inspired by following plugins:

- [prettier-plugin-organize-imports](https://github.com/simonhaenisch/prettier-plugin-organize-imports)

And, for implementation reference, the following plugins:

- [prettier-plugin-astro](https://github.com/withastro/prettier-plugin-astro)
- [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)
