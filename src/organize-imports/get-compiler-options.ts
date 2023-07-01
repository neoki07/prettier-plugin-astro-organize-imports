import { dirname } from 'path';
import ts from 'typescript';

/**
 * Get the compiler options from the path to a tsconfig.
 */
export function getCompilerOptions(tsconfig?: string) {
	const compilerOptions = tsconfig
		? ts.parseJsonConfigFileContent(
				ts.readConfigFile(tsconfig, ts.sys.readFile).config,
				ts.sys,
				dirname(tsconfig)
		  ).options
		: ts.getDefaultCompilerOptions();

	compilerOptions.allowJs = true; // for automatic JS support

	return compilerOptions;
}
