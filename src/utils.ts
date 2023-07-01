import { resolveConfig } from 'prettier';
import { loadPlugins } from './load-plugins';
import type { NamedPlugin, OptionsWithNamedPlugins } from './types';

/**
 * For loading prettier plugins only if they exist
 */
export function loadIfExists(name: string): NamedPlugin | undefined {
	try {
		if (require.resolve(name)) {
			return require(name);
		}
	} catch (e) {
		return undefined;
	}
}

/**
 * Load prettier config from the current working directory
 */
export function loadConfig(): OptionsWithNamedPlugins | undefined {
	const config = resolveConfig.sync(process.cwd());

	if (config === null) {
		return undefined;
	}

	return {
		...config,
		plugins: loadPlugins(
			config.plugins?.map((plugin) => {
				if (typeof plugin !== 'string') {
					throw new Error('Expected plugin to be a string');
				}
				return plugin;
			})
		),
	};
}
