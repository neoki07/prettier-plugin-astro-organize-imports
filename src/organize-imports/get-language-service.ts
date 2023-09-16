import ts from 'typescript'
import { getTypeScriptLanguageServiceHost } from './service-host'

/**
 * Get the correct language service for the given parser.
 */
export function getLanguageService(filepath: string, code: string) {
  return ts.createLanguageService(
    getTypeScriptLanguageServiceHost(filepath, code),
  )
}
