import { parse } from '@astrojs/compiler/sync'
import type { ParserOptions } from 'prettier'
import { organizeImports } from './organize-imports'

function substringByBytes(str: string, start: number, end?: number) {
  const encoder = new TextEncoder()
  const encodedStr = encoder.encode(str)

  const slicedArray = encodedStr.slice(start, end)

  const decoder = new TextDecoder()
  return decoder.decode(slicedArray)
}

export function organizeImportsInScriptTags(
  code: string,
  options: ParserOptions,
) {
  let formattedCode = code

  const { ast } = parse(code, { position: true })

  if (Array.isArray(ast.children)) {
    ast.children
      .slice()
      .reverse()
      .forEach((node: any) => {
        if (
          node.type === 'element' &&
          node.name === 'script' &&
          node.children.length > 0
        ) {
          const child = node.children[0]

          formattedCode =
            substringByBytes(formattedCode, 0, child.position.start.offset) +
            organizeImports(child.value, options.astroOrganizeImportsMode) +
            substringByBytes(formattedCode, child.position.end.offset)
        }
      })
  }

  return formattedCode
}
