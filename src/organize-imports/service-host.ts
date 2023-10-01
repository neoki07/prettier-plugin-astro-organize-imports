import { dirname } from 'path'
import {sys, getDefaultLibFileName, ScriptSnapshot} from 'typescript'
import { findTsconfig } from './find-tsconfig'
import { getCompilerOptions } from './get-compiler-options'

/**
 * Create the most basic TS language service host for the given file to make import sorting work.
 */
export function getTypeScriptLanguageServiceHost(
  path: string,
  content: string,
) {
  const tsconfig = findTsconfig(path)
  const compilerOptions = getCompilerOptions(tsconfig)

  return {
    directoryExists: sys.directoryExists,
    fileExists: sys.fileExists,
    getDefaultLibFileName: getDefaultLibFileName,
    getDirectories: sys.getDirectories,
    readDirectory: sys.readDirectory,
    readFile: sys.readFile,
    getCurrentDirectory: () =>
      tsconfig ? dirname(tsconfig) : sys.getCurrentDirectory(),
    getCompilationSettings: () => compilerOptions,
    getNewLine: () => sys.newLine,
    getScriptFileNames: () => [path],
    getScriptVersion: () => '0',
    getScriptSnapshot: (filePath: string) => {
      if (filePath === path) {
        return ScriptSnapshot.fromString(content)
      }
    },
  }
}
