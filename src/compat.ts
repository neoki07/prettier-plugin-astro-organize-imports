import type { Parser, Plugin, Printer } from 'prettier';
import { loadIfExists } from './utils';
import type { OptionsWithNamedPlugins } from './types';

export const compatibleAstroPlugins = ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'];

export function getCompatibleAstroParser(options?: OptionsWithNamedPlugins): Parser | undefined {
	if (!options?.plugins) {
		return undefined;
	}

	let parser: Parser | undefined = undefined;
	// Now load parsers from plugins
	for (const name of compatibleAstroPlugins) {
		const plugin = findEnabledPlugin(options, name);

		if (plugin) {
			parser = plugin.parsers?.astro;
		}
	}

	return parser;
}

export function getCompatibleAstroPrinter(options?: OptionsWithNamedPlugins): Printer | undefined {
	if (!options?.plugins) {
		return undefined;
	}

	let printer: Printer | undefined = undefined;
	// Now load parsers from plugins
	for (const name of compatibleAstroPlugins) {
		const plugin = findEnabledPlugin(options, name);

		if (plugin) {
			printer = plugin.printers?.astro;
		}
	}

	return printer;
}

function findEnabledPlugin(options: OptionsWithNamedPlugins, name: string): Plugin | undefined {
	if (options.plugins === undefined) {
		throw new Error('options.plugins is undefined');
	}

	let path: string | undefined = undefined;

	try {
		path = require.resolve(name);
	} catch (err) {
		return undefined;
	}

	const plugin = options.plugins.find((plugin) => {
		return plugin.name === name || plugin.name === path;
	});

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
