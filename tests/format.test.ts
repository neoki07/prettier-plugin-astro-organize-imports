import { describe, expect, test } from 'vitest'
import { expected, input } from './fixtures'
import { format } from './utils'

const tests = [
  {
    name: 'basic',
    input: input.basic,
    expected: expected.basic,
  },
  {
    name: 'sort and combine',
    input: input.basic,
    expected: expected.sortAndCombine,
    mode: 'SortAndCombine',
  },
  {
    name: 'remove unused',
    input: input.basic,
    expected: expected.removeUnused,
    mode: 'RemoveUnused',
  },
  {
    name: 'organize-imports-ignore',
    input: input.organizeImportsIgnore,
    expected: expected.organizeImportsIgnore,
  },
  {
    name: 'tslint:disable:ordered-imports',
    input: input.tslintDisableOrderedImports,
    expected: expected.tslintDisableOrderedImports,
  },
  {
    name: 'with prettier-plugin-astro',
    input: input.basic,
    expected: expected.withAstroPlugin,
    plugins: ['prettier-plugin-astro'],
  },
  {
    name: 'with prettier-plugin-astro and prettier-plugin-tailwindcss',
    input: input.basic,
    expected: expected.withAstroAndTailwindCSSPlugins,
    plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'],
  },
]

describe('format', () => {
  for (const { name, input, expected, mode, plugins } of tests) {
    test(name, async () => {
      const options = {
        plugins,
        astroOrganizeImportsMode: mode,
      }

      expect(await format(input, options)).toEqual(expected)
    })
  }
})
