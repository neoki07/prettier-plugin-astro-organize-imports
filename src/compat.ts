import type { Options, Parser, Plugin, Printer } from 'prettier';
import { loadIfExists } from './utils';

export const compatiblePlugins = ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'];

export function getCompatibleParser(
	parserFormat: string,
	options?: Options
): Parser<any> | undefined {
	if (!options?.plugins) {
		return undefined;
	}

	let parser: Parser<any> | undefined = undefined;
	// Now load parsers from plugins
	for (const name of compatiblePlugins) {
		const plugin = findEnabledPlugin(options, name);

		if (plugin) {
			parser = plugin.parsers?.[parserFormat];
		}
	}

	return parser;
}

export function getCompatiblePrinter(
	parserFormat: string,
	options?: Options
): Printer<any> | undefined {
	if (!options?.plugins) {
		return undefined;
	}

	let printer: Printer<any> | undefined = undefined;
	// Now load parsers from plugins
	for (const name of compatiblePlugins) {
		const plugin = findEnabledPlugin(options, name);

		if (plugin) {
			printer = plugin.printers?.[parserFormat];
		}
	}

	return printer;
}

function findEnabledPlugin(options: Options, name: string): Plugin<any> | undefined {
	if (options.plugins === undefined) {
		throw new Error('options.plugins is undefined');
	}

	let path: string | undefined = undefined;

	try {
		path = require.resolve(name);
	} catch (err) {
		return undefined;
	}

	const plugin = options.plugins.find(
		(plugin: any) => plugin.name === name || plugin.name === path
	) as Plugin<any>;

	// The plugin was found by name or path
	if (plugin) {
		return plugin;
	}

	// The plugin was loaded with require so we use object equality to find it
	const mod = loadIfExists(path);
	if (mod && mod.parsers && options.plugins.includes(mod)) {
		return mod;
	}

	return undefined;
}
