/**
 * Simple memoization utility that only uses the first argument as cache key and has no memory limit.
 */
export function memoize(f: (...args: any[]) => any) {
  const cache = new Map()

  // @ts-ignore
  return function (cacheKey, ...rest) {
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)
    }

    const result = f(cacheKey, ...rest)

    cache.set(cacheKey, result)

    return result
  }
}
