import {
	type AstPath,
	type ChoiceSupportOption,
	type Doc,
	type Parser,
	type Printer,
	type SupportLanguage,
	type SupportOptions,
} from 'prettier';
import { organizeImports } from './organize-imports';
import { getCompatibleAstroParser, getCompatibleAstroPrinter } from './compat';
import { loadConfig } from './utils';
import { OrganizeImportsMode } from 'typescript';

const config = loadConfig();
const compatibleAstroParser = getCompatibleAstroParser(config);
const compatibleAstroPrinter = getCompatibleAstroPrinter(config);

export const languages: Partial<SupportLanguage>[] = [
	{
		name: 'astro',
		parsers: ['astro'],
		extensions: ['.astro'],
		vscodeLanguageIds: ['astro'],
	},
];

export const parsers: Record<string, Parser> = {
	astro: compatibleAstroParser
		? {
				...compatibleAstroParser,
				preprocess(text: string, options: any) {
					return organizeImports(
						compatibleAstroParser.preprocess
							? compatibleAstroParser.preprocess(text, options)
							: text,
						options.astroOrganizeImportsMode,
						options.endOfLine
					);
				},
		  }
		: {
				parse(text: string) {
					return text;
				},
				astFormat: 'astro',
				locStart: (node) => node.position.start.offset,
				locEnd: (node) => node.position.end.offset,
				preprocess(code: string, options: any) {
					return organizeImports(code, options.astroOrganizeImportsMode, options.endOfLine);
				},
		  },
};

export const printers: Record<string, Printer> = {
	astro: compatibleAstroPrinter
		? compatibleAstroPrinter
		: {
				print(path: AstPath): Doc {
					const node = path.getValue();

					if (typeof node === 'string') {
						return node;
					}

					return node.value;
				},
		  },
};

const modeOption: ChoiceSupportOption<OrganizeImportsMode> = {
	type: 'choice',
	default: OrganizeImportsMode.All,
	category: 'OrganizeImports',
	description: 'Organize imports mode',
	choices: [
		{
			value: OrganizeImportsMode.All,
			description:
				'Removing unused imports, coalescing imports from the same module, and sorting imports',
		},
		{
			value: OrganizeImportsMode.SortAndCombine,
			description: 'Coalesce imports from the same module and sorting imports',
		},
		{
			value: OrganizeImportsMode.RemoveUnused,
			description: 'Removing unused imports',
		},
	],
	since: '0.2.0',
};

export const options: SupportOptions = {
	astroOrganizeImportsMode: modeOption,
};
