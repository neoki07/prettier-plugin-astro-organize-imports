import { OrganizeImportsMode } from 'typescript'
import { describe, expect, test } from 'vitest'
import { format, readFixture } from './utils'

const tests = [
  {
    name: 'basic',
    fixtureDir: 'basic',
  },
  {
    name: 'sort and combine',
    fixtureDir: 'sort-and-combine',
    mode: OrganizeImportsMode.SortAndCombine,
  },
  {
    name: 'remove unused',
    fixtureDir: 'remove-unused',
    mode: OrganizeImportsMode.RemoveUnused,
  },
  {
    name: 'function in JSX',
    fixtureDir: 'function-in-jsx',
  },
  {
    name: 'function in JSX 2',
    fixtureDir: 'function-in-jsx-2',
  },
  {
    name: 'function in expression',
    fixtureDir: 'function-in-expression',
  },
  {
    name: 'empty script tag',
    fixtureDir: 'empty-script-tag',
    plugins: [],
  },
  {
    name: 'inside script tags',
    fixtureDir: 'script-tags',
    plugins: [],
  },
  {
    name: 'multi-byte characters',
    fixtureDir: 'multi-byte-characters',
    plugins: [],
  },
  {
    name: 'organize-imports-ignore',
    fixtureDir: 'organize-imports-ignore',
  },
  {
    name: 'tslint:disable:ordered-imports',
    fixtureDir: 'tslint-disable-ordered-imports',
  },
  {
    name: 'with prettier-plugin-astro',
    fixtureDir: 'with-astro-plugin',
    plugins: ['prettier-plugin-astro'],
  },
  {
    name: 'with prettier-plugin-astro and prettier-plugin-tailwindcss',
    fixtureDir: 'with-astro-and-tailwindcss-plugins',
    plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'],
  },
]

describe('format', () => {
  for (const { name, fixtureDir, mode, plugins } of tests) {
    test(name, async () => {
      const { input, expected } = readFixture(fixtureDir)

      const options = {
        plugins,
        astroOrganizeImportsMode: mode,
      }

      expect(await format(input, options)).toEqual(expected)
    })
  }
})
