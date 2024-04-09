import { parse } from '@astrojs/compiler/sync'
import type { Node } from '@astrojs/compiler/types'
import { substringByBytes } from './substring'

const componentName = 'PrettierPluginAstroOrganizeImports'

export function wrapExpressionWithComponent(code: string) {
  const { ast } = parse(code, { position: true })

  let formattedCode = code
  if (Array.isArray(ast.children)) {
    ast.children
      .slice()
      .reverse()
      .forEach((node: Node) => {
        if (node.type === 'expression') {
          if (!(node.position && node.position.end)) {
            console.error('Invalid node:', node)
            return
          }

          const wrappedExpressionCode =
            `<${componentName}>` +
            substringByBytes(
              formattedCode,
              node.position.start.offset,
              node.position.end.offset,
            ) +
            `</${componentName}>`

          formattedCode =
            substringByBytes(formattedCode, 0, node.position.start.offset) +
            wrappedExpressionCode +
            substringByBytes(formattedCode, node.position.end.offset)
        }
      })
  }

  return formattedCode
}

export function unwrapExpressionWithComponent(code: string) {
  const tagRegex = new RegExp(
    `<${componentName}>(.*?)</${componentName}>`,
    'gs',
  )
  return code.replace(tagRegex, '$1')
}
