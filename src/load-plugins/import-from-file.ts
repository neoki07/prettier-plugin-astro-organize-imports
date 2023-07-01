import { pathToFileURL } from 'node:url';

export function importFromFile(specifier: string, parent: string) {
	const url = require.resolve(specifier, { paths: [pathToFileURL(parent).href] });
	return require(url);
}
