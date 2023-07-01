import path from 'node:path';
import { importFromFile } from './import-from-file';

export function importFromDirectory(specifier: string, directory: string) {
	return importFromFile(specifier, path.join(directory, 'noop.js'));
}
