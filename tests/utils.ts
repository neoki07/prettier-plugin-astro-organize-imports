import { readFileSync } from 'fs'
import path from 'path'
import prettier, { type Options } from 'prettier'

const pluginPath = path.resolve(__dirname, '../dist/index.mjs')

export async function format(str: string, options: Options) {
  const result = await prettier.format(str, {
    semi: false,
    singleQuote: true,
    printWidth: 9999,
    parser: 'astro',
    ...options,
    plugins: [...(options.plugins ?? []), pluginPath],
  })

  return result.trim()
}

export function readFixture(fixtureDir: string) {
  const inputPath = path.resolve(
    __dirname,
    path.join('fixtures', fixtureDir, 'input.astro'),
  )
  const input = readFileSync(inputPath, 'utf8').trim()

  const expectedPath = path.resolve(
    __dirname,
    path.join('fixtures', fixtureDir, 'expected.astro'),
  )
  const expected = readFileSync(expectedPath, 'utf8').trim()

  return { input, expected }
}
