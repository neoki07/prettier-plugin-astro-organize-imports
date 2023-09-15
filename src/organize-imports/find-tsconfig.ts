import ts from 'typescript'
import { memoize } from './memoize'

/**
 * Find the path of the project's tsconfig from a path to a file in the project.
 */
export const findTsconfig = memoize((path: string) =>
  ts.findConfigFile(path, ts.sys.fileExists),
)
