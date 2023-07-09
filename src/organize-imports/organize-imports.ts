import { applyTextChanges } from './apply-text-changes';
import { getLanguageService } from './get-language-service';
import { type OrganizeImportsMode } from "typescript";

const NOOP_PATH = 'noop.ts';

/**
 * Organize the given code's imports.
 */
function organize(code: string, mode: OrganizeImportsMode) {
	const languageService = getLanguageService(NOOP_PATH, code);

	const fileChanges = languageService.organizeImports(
		{
			type: 'file',
			fileName: NOOP_PATH,
			mode,
		},
		{},
		{}
	)[0];

	return fileChanges ? applyTextChanges(code, fileChanges.textChanges) : code;
}

/**
 * Organize the code's imports using the `organizeImports` feature of the TypeScript language service API.
 */
export function organizeImports(code: string, mode: OrganizeImportsMode) {
	if (
		code.includes('// organize-imports-ignore') ||
		code.includes('// tslint:disable:ordered-imports')
	) {
		return code;
	}

	try {
		const formatted = organize(code, mode);
		// TODO: follow endOfLine option of prettier
		return formatted.replace(/(\r\n|\r)/gm, '\n');
	} catch (error) {
		if (process.env.DEBUG) {
			console.error(error);
		}

		return code;
	}
}
