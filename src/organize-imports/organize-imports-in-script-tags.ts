import type { ParserOptions } from 'prettier'
import type { loadPlugin } from '../plugins'
import { organizeImports } from './organize-imports'

export function organizeImportsInScriptTags(
  code: string,
  options: ParserOptions,
  plugin: Awaited<ReturnType<typeof loadPlugin>>,
) {
  const ast = plugin.parser.parse(code, options)

  let formattedCode = code

  if (Array.isArray(ast.children)) {
    ast.children
      .slice()
      .reverse()
      .forEach((node) => {
        if (
          node.type === 'element' &&
          node.name === 'script' &&
          node.children.length > 0
        ) {
          const child = node.children[0]

          formattedCode =
            formattedCode.substring(0, child.position.start.offset) +
            organizeImports(child.value, options.astroOrganizeImportsMode) +
            formattedCode.substring(child.position.end.offset)
        }
      })
  }

  return formattedCode
}
