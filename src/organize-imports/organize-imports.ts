import type { OrganizeImportsMode } from 'typescript'
import { applyTextChanges } from './apply-text-changes'
import {
  ORGANIZE_IMPORTS_IGNORE_COMMENT,
  TSLINT_DISABLE_ORDERED_IMPORTS_COMMENT,
} from './constants'
import { getLanguageService } from './get-language-service'

const FILE_PATH = 'file.tsx'

/**
 * Organize the given code's imports.
 */
function organize(code: string, mode: OrganizeImportsMode) {
  const languageService = getLanguageService(FILE_PATH, code)

  const fileChanges = languageService.organizeImports(
    {
      type: 'file',
      fileName: FILE_PATH,
      mode,
    },
    {},
    {},
  )[0]

  return fileChanges ? applyTextChanges(code, fileChanges.textChanges) : code
}

/**
 * Organize the code's imports using the `organizeImports` feature of the TypeScript language service API.
 */
export function organizeImports(code: string, mode: OrganizeImportsMode) {
  if (
    code.includes(ORGANIZE_IMPORTS_IGNORE_COMMENT) ||
    code.includes(TSLINT_DISABLE_ORDERED_IMPORTS_COMMENT)
  ) {
    return code
  }

  try {
    const formatted = organize(code, mode)
    // TODO: follow endOfLine option of prettier
    return formatted.replace(/(\r\n|\r)/gm, '\n')
  } catch (error) {
    if (process.env.DEBUG) {
      console.error(error)
    }

    return code
  }
}
