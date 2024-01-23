import { OrganizeImportsMode } from 'typescript'
import { describe, expect, test } from 'vitest'
import { format, readFixture } from './utils'

const tests = [
  {
    name: 'basic',
    input: readFixture('input-basic'),
    expected: readFixture('expected-basic'),
  },
  {
    name: 'sort and combine',
    input: readFixture('input-basic'),
    expected: readFixture('expected-sort-and-combine'),
    mode: OrganizeImportsMode.SortAndCombine,
  },
  {
    name: 'remove unused',
    input: readFixture('input-basic'),
    expected: readFixture('expected-remove-unused'),
    mode: OrganizeImportsMode.RemoveUnused,
  },
  {
    name: 'function in JSX',
    input: readFixture('function-in-jsx'),
    expected: readFixture('function-in-jsx'),
  },
  {
    name: 'empty script tag',
    input: readFixture('empty-script-tag'),
    expected: readFixture('empty-script-tag'),
    plugins: [],
  },
  {
    name: 'inside script tags',
    input: readFixture('input-script-tags'),
    expected: readFixture('expected-script-tags'),
    plugins: [],
  },
  {
    name: 'organize-imports-ignore',
    input: readFixture('organize-imports-ignore'),
    expected: readFixture('organize-imports-ignore'),
  },
  {
    name: 'tslint:disable:ordered-imports',
    input: readFixture('tslint-disable-ordered-imports'),
    expected: readFixture('tslint-disable-ordered-imports'),
  },
  {
    name: 'with prettier-plugin-astro',
    input: readFixture('input-basic'),
    expected: readFixture('expected-with-astro-plugin'),
    plugins: ['prettier-plugin-astro'],
  },
  {
    name: 'with prettier-plugin-astro and prettier-plugin-tailwindcss',
    input: readFixture('input-basic'),
    expected: readFixture('expected-with-astro-and-tailwindcss-plugins'),
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
