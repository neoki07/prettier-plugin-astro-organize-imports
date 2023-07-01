import path from 'node:path';
import { importFromDirectory } from './import-from-directory';
import type { NamedPlugin } from '../types';
import type { Plugin } from 'prettier';

function normalizePlugin(plugin: Plugin, name: string): NamedPlugin {
	return { name, ...plugin };
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

export function loadPlugin(pluginName: string) {
	return normalizePlugin(importPlugin(pluginName), pluginName);
}
