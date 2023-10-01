import type { TextChange } from 'typescript'

/**
 * Apply the given set of text changes to the input.
 */
export function applyTextChanges(
  input: string,
  changes: readonly TextChange[],
) {
  return changes.reduceRight((text, change) => {
    const head = text.slice(0, change.span.start)
    const tail = text.slice(change.span.start + change.span.length)

    return `${head}${change.newText}${tail}`
  }, input)
}
