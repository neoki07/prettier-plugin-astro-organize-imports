// For loading prettier plugins only if they exist
export function loadIfExists(name) {
  try {
    if (require.resolve(name)) {
      return require(name)
    }
  } catch (e) {
    return null
  }
}
