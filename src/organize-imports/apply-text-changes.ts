import ts from 'typescript'

/**
 * Apply the given set of text changes to the input.
 *
 * @param {string} input
 * @param {readonly import('typescript').TextChange[]} changes
 */
export function applyTextChanges(
  input: string,
  changes: readonly ts.TextChange[],
) {
  return changes.reduceRight((text, change) => {
    const head = text.slice(0, change.span.start)
    const tail = text.slice(change.span.start + change.span.length)

    return `${head}${change.newText}${tail}`
  }, input)
}
