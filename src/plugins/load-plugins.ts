import type { Plugin } from 'prettier';
import { loadPlugin } from './load-plugin';

function loadPlugins(plugins: (string | Plugin<any>)[] = []) {
	return plugins.map((plugin) => loadPlugin(plugin));
}

export default loadPlugins;
