import { dirname } from 'path'
import { memoize } from './memoize'
import {parseJsonConfigFileContent, sys, readConfigFile, getDefaultCompilerOptions} from "typescript";

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
