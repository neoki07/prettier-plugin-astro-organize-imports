import { sep, posix } from 'path';
import { applyTextChanges } from './apply-text-changes';
import { getLanguageService } from './get-language-service';

/**
 * Organize the given code's imports.
 *
 * @param {string} code
 * @param {import('prettier').ParserOptions} options
 */
export function organize(
	code,
	{ filepath = 'file.ts', organizeImportsSkipDestructiveCodeActions, parentParser, parser },
) {
	if (parentParser === 'vue') {
		// we already did the preprocessing in the parent parser, so we skip the child parsers
		return code;
	}

	if (sep !== posix.sep) {
		filepath = filepath.split(sep).join(posix.sep);
	}

	const languageService = getLanguageService(parser, filepath, code);

	const fileChanges = languageService.organizeImports(
		{ type: 'file', fileName: filepath, skipDestructiveCodeActions: organizeImportsSkipDestructiveCodeActions },
		{},
		{},
	)[0];

	return fileChanges ? applyTextChanges(code, fileChanges.textChanges) : code;
};
