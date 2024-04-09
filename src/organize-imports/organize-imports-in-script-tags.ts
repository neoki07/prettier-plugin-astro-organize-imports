import { parse } from '@astrojs/compiler/sync'
import type { Node } from '@astrojs/compiler/types'
import type { ParserOptions } from 'prettier'
import { organizeImports } from './organize-imports'
import { substringByBytes } from './substring'

export function organizeImportsInScriptTags(
  code: string,
  options: ParserOptions,
) {
  const { ast } = parse(code, { position: true })

  let formattedCode = code
  if (Array.isArray(ast.children)) {
    ast.children
      .slice()
      .reverse()
      .forEach((node: Node) => {
        if (
          node.type === 'element' &&
          node.name === 'script' &&
          node.children.length > 0
        ) {
          const child = node.children[0]

          if (!(child.position && child.position.end && 'value' in child)) {
            console.error('Invalid node:', child)
            return
          }

          formattedCode =
            substringByBytes(formattedCode, 0, child.position.start.offset) +
            organizeImports(child.value, options.astroOrganizeImportsMode) +
            substringByBytes(formattedCode, child.position.end.offset)
        }
      })
  }

  return formattedCode
}
