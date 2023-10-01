import { getTypeScriptLanguageServiceHost } from './service-host'
import {createLanguageService} from "typescript";

/**
 * Get the correct language service for the given parser.
 */
export function getLanguageService(filepath: string, code: string) {
  return createLanguageService(
    getTypeScriptLanguageServiceHost(filepath, code),
  )
}
