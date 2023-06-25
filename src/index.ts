import type { Parser, SupportLanguage } from 'prettier';
import { organize } from './lib/organize';
import { parsers as astroParsers } from 'prettier-plugin-astro';

/**
 * Organize the code's imports using the `organizeImports` feature of the TypeScript language service API.
 *
 * @param {string} code
 */
function organizeImports(code: string) {
	if (
		code.includes('// organize-imports-ignore') ||
		code.includes('// tslint:disable:ordered-imports')
	) {
		return code;
	}

	try {
		return organize(code);
	} catch (error) {
		if (process.env.DEBUG) {
			console.error(error);
		}

		return code;
	}
}

// https://prettier.io/docs/en/plugins.html#languages
export const languages: Partial<SupportLanguage>[] = [
	{
		name: 'AstroWithOrganizeImports',
		parsers: ['astro-with-organize-imports'],
		extensions: ['.astro'],
		vscodeLanguageIds: ['astro'],
	},
];

// https://prettier.io/docs/en/plugins.html#parsers
export const parsers: Record<string, Parser> = {
	'astro-with-organize-imports': {
		...astroParsers.astro,
		preprocess: (code, options) =>
			organizeImports(
				astroParsers.astro.preprocess ? astroParsers.astro.preprocess(code, options) : code
			),
	},
};
