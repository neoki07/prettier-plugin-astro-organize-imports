export function substringByBytes(str: string, start: number, end?: number) {
  const encoder = new TextEncoder()
  const encodedStr = encoder.encode(str)

  const slicedArray = encodedStr.slice(start, end)

  const decoder = new TextDecoder()
  return decoder.decode(slicedArray)
}
