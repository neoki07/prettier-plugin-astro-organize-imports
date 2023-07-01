import path from 'node:path';
import importFromDirectory from '../utils/import-from-directory';
import type { Plugin } from 'prettier';

function normalizePlugin(pluginInstanceOfPluginModule: any, name: string) {
	const plugin = pluginInstanceOfPluginModule.default ?? pluginInstanceOfPluginModule;
	return { name, ...plugin };
}

function loadPluginFromDirectory(name: string, directory: string) {
	return normalizePlugin(importFromDirectory(name, directory), name);
}

function importPlugin(name: string) {
	try {
		// try local files
		return require(path.resolve(name));
	} catch {
		// try node modules
		return importFromDirectory(name, process.cwd());
	}
}

function loadPlugin(plugin: string | Plugin<any>) {
	if (typeof plugin === 'string') {
		return normalizePlugin(importPlugin(plugin), plugin);
	}

	return plugin;
}

export { loadPlugin, loadPluginFromDirectory };
