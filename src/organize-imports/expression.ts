import { parse } from '@astrojs/compiler/sync'
import { substringByBytes } from './substring'

const componentName = 'PrettierPluginAstroOrganizeImports'

export function wrapExpressionWithComponent(code: string) {
  const { ast } = parse(code, { position: true })

  let formattedCode = code
  if (Array.isArray(ast.children)) {
    const reversedChildNodes = ast.children.slice().reverse()

    reversedChildNodes.forEach((node, index) => {
      if (node.type === 'expression') {
        if (!(node.position && node.position.end)) {
          console.error('Invalid node:', node)
          return
        }

        const nextNode =
          index - 1 >= 0 ? reversedChildNodes[index - 1] : undefined

        const startOffset = node.position.start.offset
        const endOffset = nextNode?.position?.start?.offset
          ? nextNode.position.start.offset - 1
          : node.position.end.offset

        const wrappedExpressionCode =
          `<${componentName}>` +
          substringByBytes(formattedCode, startOffset, endOffset) +
          `</${componentName}>`

        formattedCode =
          substringByBytes(formattedCode, 0, startOffset) +
          wrappedExpressionCode +
          substringByBytes(formattedCode, endOffset)
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
