import ts from 'typescript';
import { memoize } from './memoize';

/**
 * Find the path of the project's tsconfig from a path to a file in the project.
 *
 * @type {(path: string) => string | undefined}
 */
export const findTsconfig = memoize((path) => ts.findConfigFile(path, ts.sys.fileExists));
