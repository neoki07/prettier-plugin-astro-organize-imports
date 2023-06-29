import ts from 'typescript';
import { memoize } from './memolize';

/**
 * Find the path of the project's tsconfig from a path to a file in the project.
 */
export const findTsconfig: (path: string) => string | undefined = memoize((path) =>
	ts.findConfigFile(path, ts.sys.fileExists)
);
