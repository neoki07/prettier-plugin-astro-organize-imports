import ts from 'typescript'
import { getTypeScriptLanguageServiceHost } from './service-host'

/**
 * Get the correct language service for the given parser.
 *
 * @param {string} filepath
 * @param {string} code
 *
 * @returns {import('typescript').LanguageService}
 */
export function getLanguageService(filepath, code) {
  return ts.createLanguageService(
    getTypeScriptLanguageServiceHost(filepath, code),
  )
}
