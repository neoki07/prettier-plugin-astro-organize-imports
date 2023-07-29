import type { RequiredOptions } from 'prettier';
import { applyTextChanges } from './apply-text-changes';
import { getLanguageService } from './get-language-service';
import { type OrganizeImportsMode } from 'typescript';

const DUMMY_PATH = 'file.ts';

function organize(code: string, mode: OrganizeImportsMode) {
	const languageService = getLanguageService(DUMMY_PATH, code);

	const fileChanges = languageService.organizeImports(
		{
			type: 'file',
			fileName: DUMMY_PATH,
			mode,
		},
		{},
		{}
	)[0];

	return fileChanges ? applyTextChanges(code, fileChanges.textChanges) : code;
}

function getFirstEndOfLine(code: string) {
	const match = /\r\n|\r|\n/.exec(code);
	return match ? match[0] : undefined;
}

function replaceEndOfLine(code: string, endOfLine: RequiredOptions['endOfLine']) {
	if (endOfLine === 'auto') {
		const firstEndOfLine = getFirstEndOfLine(code);
		return firstEndOfLine ? code.replace(/\r\n|\r|\n/g, firstEndOfLine) : code;
	} else if (endOfLine === 'lf') {
		return code.replace(/\r\n|\r|\n/g, '\n');
	} else if (endOfLine === 'crlf') {
		return code.replace(/\r\n|\r|\n/g, '\r\n');
	} else if (endOfLine === 'cr') {
		return code.replace(/\r\n|\r|\n/g, '\r');
	}
	throw new Error(`Invalid endOfLine value: ${endOfLine}`);
}

/**
 * Organize the code's imports using the `organizeImports` feature of the TypeScript language service API.
 */
export function organizeImports(
	code: string,
	mode: OrganizeImportsMode,
	endOfLine: RequiredOptions['endOfLine']
) {
	if (
		code.includes('// organize-imports-ignore') ||
		code.includes('// tslint:disable:ordered-imports')
	) {
		return code;
	}

	try {
		const formatted = organize(code, mode);
		return replaceEndOfLine(formatted, endOfLine);
	} catch (error) {
		if (process.env.DEBUG) {
			console.error(error);
		}

		return code;
	}
}
