import { loadPlugin } from './load-plugin';
import type { NamedPlugin } from '../types';

export function loadPlugins(pluginNames: string[] = []): NamedPlugin[] {
	return pluginNames.map((pluginName) => loadPlugin(pluginName));
}
