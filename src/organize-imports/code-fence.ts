import { parse } from '@astrojs/compiler/sync'
import { substringByBytes } from './substring'

export function encodeCodeFences(code: string) {
  const { ast } = parse(code, { position: true })

  const frontmatter = ast.children.find((node) => node.type === 'frontmatter')
  if (!frontmatter) {
    return code
  }

  if (!frontmatter.position || !frontmatter.position.end) {
    console.error('Invalid frontmatter node:', frontmatter)
    return code
  }

  const frontmatterCode = substringByBytes(
    code,
    frontmatter.position.start.offset,
    frontmatter.position.end.offset,
  )

  return (
    substringByBytes(code, 0, frontmatter.position.start.offset) +
    frontmatterCode.replace(
      /^(.*?)---|---(?!.*---)/g,
      '$1//prettier-plugin-astro-organize-imports:code-fence',
    ) +
    substringByBytes(code, frontmatter.position.end.offset)
  )
}

export function decodeCodeFences(code: string) {
  return code.replace(
    /\/\/prettier-plugin-astro-organize-imports:code-fence/g,
    '---',
  )
}
