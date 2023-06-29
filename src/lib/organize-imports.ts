import { applyTextChanges } from './apply-text-changes';
import { getLanguageService } from './get-language-service';
import type { Options } from './types';

const DUMMY_FILEPATH = 'file.ts';

/**
 * Organize the given code's imports.
 */
function organize(code: string, { organizeImportsSkipDestructiveCodeActions }: Options) {
	const languageService = getLanguageService(DUMMY_FILEPATH, code);

	const fileChanges = languageService.organizeImports(
		{
			type: 'file',
			fileName: DUMMY_FILEPATH,
			skipDestructiveCodeActions: organizeImportsSkipDestructiveCodeActions,
		},
		{},
		{}
	)[0];

	const formatted = fileChanges ? applyTextChanges(code, fileChanges.textChanges) : code;
	// TODO: follow prettier's endOfLine option
	return formatted.replace(/(\r\n|\r)/gm, '\n');
}

/**
 * Organize the code's imports using the `organizeImports` feature of the TypeScript language service API.
 */
export function organizeImports(code: string, options: Options) {
	if (
		code.includes('// organize-imports-ignore') ||
		code.includes('// tslint:disable:ordered-imports')
	) {
		return code;
	}

	try {
		return organize(code, options);
	} catch (error) {
		if (process.env.DEBUG) {
			console.error(error);
		}

		return code;
	}
}
