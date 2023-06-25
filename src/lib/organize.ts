import { sep, posix } from 'path';
import { applyTextChanges } from './apply-text-changes';
import { getLanguageService } from './get-language-service';
import type { ParserOptions } from 'prettier';

/**
 * Organize the given code's imports.
 *
 * @param {string} code
 * @param {import('prettier').ParserOptions} options
 */
export function organize(code: string, { filepath = 'file.ts' }: ParserOptions) {
	if (sep !== posix.sep) {
		filepath = filepath.split(sep).join(posix.sep);
	}

	const languageService = getLanguageService(filepath, code);

	const fileChanges = languageService.organizeImports(
		{
			type: 'file',
			fileName: filepath,
		},
		{},
		{}
	)[0];

	return fileChanges ? applyTextChanges(code, fileChanges.textChanges) : code;
}
