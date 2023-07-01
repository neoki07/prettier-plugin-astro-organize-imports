import { type Parser, type Printer, type SupportLanguage, type AstPath, type Doc } from 'prettier';
import { organizeImports } from './lib/organize-imports';
import { getCompatibleParser, getCompatiblePrinter } from './compat';
import { loadConfig } from './utils';

const config = loadConfig();
const compatibleParser = getCompatibleParser('astro', config);
const compatiblePrinter = getCompatiblePrinter('astro', config);

export const languages: Partial<SupportLanguage>[] = [
	{
		name: 'astro',
		parsers: ['astro'],
		extensions: ['.astro'],
		vscodeLanguageIds: ['astro'],
	},
];

export const parsers: Record<string, Parser> = {
	astro: compatibleParser
		? {
				...compatibleParser,
				preprocess(text: string, options: any) {
					return organizeImports(
						compatibleParser.preprocess ? compatibleParser.preprocess(text, options) : text,
						options
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
					return organizeImports(code, options);
				},
		  },
};

export const printers: Record<string, Printer> = {
	astro: compatiblePrinter
		? {
				...compatiblePrinter,
		  }
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
