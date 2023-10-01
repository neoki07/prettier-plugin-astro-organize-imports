import path from 'path'
import prettier, { type Options } from 'prettier'

const pluginPath = path.resolve(__dirname, '../dist/index.mjs')

export async function format(str: string, options: Options = {}) {
  let result = await prettier.format(str, {
    semi: false,
    singleQuote: true,
    printWidth: 9999,
    parser: 'astro',
    ...options,
    plugins: [...(options.plugins ?? []), pluginPath],
  })

  return result.trim()
}
