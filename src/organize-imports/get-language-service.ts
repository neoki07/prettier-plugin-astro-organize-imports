import { createLanguageService } from 'typescript'
import { getTypeScriptLanguageServiceHost } from './service-host'

/**
 * Get the correct language service for the given parser.
 */
export function getLanguageService(filepath: string, code: string) {
  return createLanguageService(getTypeScriptLanguageServiceHost(filepath, code))
}
