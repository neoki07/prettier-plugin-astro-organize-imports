import { describe, expect, test } from 'vitest'
import {format} from './utils'
import {expected, input} from "./fixtures";

const tests = [
  {
    name: 'basic',
    expected: expected.basic,
  },
  {
    name: 'sort and combine',
    expected: expected.sortAndCombine,
    mode: 'SortAndCombine',
  },
  {
    name: 'remove unused',
    expected: expected.removeUnused,
    mode: 'RemoveUnused',
  },
  {
    name: 'with prettier-plugin-astro',
    expected: expected.withAstroPlugin,
    plugins: ['prettier-plugin-astro'],
  },
  {
    name: 'with prettier-plugin-astro and prettier-plugin-tailwindcss',
    expected: expected.withAstroAndTailwindCSSPlugins,
    plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'],
  }
]

describe('format', () => {
  for (const { name, expected , mode, plugins} of tests) {
    test(name, async () => {
      const options = {
        plugins,
        astroOrganizeImportsMode: mode
      }

      expect(await format(input, options)).toEqual(expected)
    })
  }
})
