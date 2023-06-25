import { sep, posix } from 'path';
import { applyTextChanges } from './apply-text-changes';
import { getLanguageService } from './get-language-service';

/**
 * Organize the given code's imports.
 *
 * @param {string} code
 */
export function organize(code: string) {
	let filepath = 'file.ts';

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

	const formatted = fileChanges ? applyTextChanges(code, fileChanges.textChanges) : code;
	// TODO: follow prettier's endOfLine option
	return formatted.replace(/(\r\n|\r)/gm, '\n');
}
