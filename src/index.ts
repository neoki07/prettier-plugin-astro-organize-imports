import type { Parser, SupportOptions } from 'prettier';
import { organizeImports } from './lib/organize-imports';
import { parsers as astroParsers } from 'prettier-plugin-astro';

export const options: SupportOptions = {
	organizeImportsSkipDestructiveCodeActions: {
		type: 'boolean',
		default: false,
		category: 'OrganizeImports',
		description: 'Skip destructive code actions like removing unused imports.',
		since: '0.0.1',
	},
};

export const parsers: Record<string, Parser> = {
	astro: {
		...astroParsers.astro,
		preprocess: (code, opts: any) =>
			organizeImports(
				astroParsers.astro.preprocess ? astroParsers.astro.preprocess(code, opts) : code,
				opts
			),
	},
};
