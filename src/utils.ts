import { resolveConfig, type Plugin, type Options } from 'prettier';
import { loadPlugins } from './plugins';

/**
 * For loading prettier plugins only if they exist
 */
export function loadIfExists(name: string): Plugin<any> | undefined {
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
export function loadConfig(): Options | undefined {
	const config = resolveConfig.sync(process.cwd());

	if (config === null) {
		return undefined;
	}

	return {
		...config,
		plugins: loadPlugins(config.plugins),
	};
}
