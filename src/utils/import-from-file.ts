import { pathToFileURL } from 'node:url';

function importFromFile(specifier: string, parent: string) {
	const url = require.resolve(specifier, { paths: [pathToFileURL(parent).href] });
	return require(url);
}

export default importFromFile;
