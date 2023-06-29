import type { ParserOptions } from 'prettier';

export interface Options extends ParserOptions {
	organizeImportsSkipDestructiveCodeActions: boolean;
}
