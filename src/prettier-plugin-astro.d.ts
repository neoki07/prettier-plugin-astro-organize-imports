declare module 'prettier-plugin-astro' {
	import { Parser } from 'prettier';

	export const parsers: Record<string, Parser>;
}
