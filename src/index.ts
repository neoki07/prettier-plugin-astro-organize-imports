import type { Parser, ParserOptions, Printer, SupportLanguage } from 'prettier';
import { print } from './lib/print';
import { organize } from './lib/organize';

/**
 * Organize the code's imports using the `organizeImports` feature of the TypeScript language service API.
 *
 * @param {string} code
 * @param {import('prettier').ParserOptions} options
 */
function organizeImports(code: string, opts: ParserOptions) {
	if (
		code.includes('// organize-imports-ignore') ||
		code.includes('// tslint:disable:ordered-imports')
	) {
		return code;
	}

	try {
		return organize(code, opts);
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
		name: 'astro',
		parsers: ['astro'],
		extensions: ['.astro'],
		vscodeLanguageIds: ['astro'],
	},
];

// https://prettier.io/docs/en/plugins.html#parsers
export const parsers: Record<string, Parser> = {
	astro: {
		parse: (source, _, opts) => organizeImports(source, opts),
		astFormat: 'astro',
		locStart: (node) => node.position.start.offset,
		locEnd: (node) => node.position.end.offset,
	},
};

// https://prettier.io/docs/en/plugins.html#printers
export const printers: Record<string, Printer> = {
	astro: {
		print,
	},
};
