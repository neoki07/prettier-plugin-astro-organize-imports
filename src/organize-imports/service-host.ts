import { dirname } from 'path';
import ts from 'typescript';
import { findTsconfig } from './find-tsconfig';
import { getCompilerOptions } from './get-compiler-options';

/**
 * Create the most basic TS language service host for the given file to make import sorting work.
 */
export function getTypeScriptLanguageServiceHost(path: string, content: string) {
	const tsconfig = findTsconfig(path);
	const compilerOptions = getCompilerOptions(tsconfig);

	return {
		directoryExists: ts.sys.directoryExists,
		fileExists: ts.sys.fileExists,
		getDefaultLibFileName: ts.getDefaultLibFileName,
		getDirectories: ts.sys.getDirectories,
		readDirectory: ts.sys.readDirectory,
		readFile: ts.sys.readFile,
		getCurrentDirectory: () => (tsconfig ? dirname(tsconfig) : ts.sys.getCurrentDirectory()),
		getCompilationSettings: () => compilerOptions,
		getNewLine: () => ts.sys.newLine,
		getScriptFileNames: () => [path],
		getScriptVersion: () => '0',
		getScriptSnapshot: (filePath: string) => {
			if (filePath === path) {
				return ts.ScriptSnapshot.fromString(content);
			}
		},
	};
}
