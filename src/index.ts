import { type Parser, type Printer, type SupportLanguage, type AstPath, type Doc } from 'prettier';
import { organizeImports } from './organize-imports';
import { getCompatibleAstroParser, getCompatibleAstroPrinter } from './compat';
import { loadConfig } from './utils';

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
							: text
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
				preprocess(code: string) {
					return organizeImports(code);
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
