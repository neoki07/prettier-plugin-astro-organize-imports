import { dirname } from 'path'
import {
  getDefaultCompilerOptions,
  parseJsonConfigFileContent,
  readConfigFile,
  sys,
} from 'typescript'
import { memoize } from './memoize'

/**
 * Get the compiler options from the path to a tsconfig.
 */
export const getCompilerOptions = memoize((tsconfig?: string) => {
  const compilerOptions = tsconfig
    ? parseJsonConfigFileContent(
        readConfigFile(tsconfig, sys.readFile).config,
        sys,
        dirname(tsconfig),
      ).options
    : getDefaultCompilerOptions()

  compilerOptions.allowJs = true // for automatic JS support

  return compilerOptions
})
