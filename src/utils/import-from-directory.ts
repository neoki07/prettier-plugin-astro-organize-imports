import path from 'node:path';
import importFromFile from './import-from-file';

function importFromDirectory(specifier: string, directory: string) {
	return importFromFile(specifier, path.join(directory, 'noop.js'));
}

export default importFromDirectory;
