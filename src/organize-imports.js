import { organize } from './organize';

/**
 * Organize the code's imports using the `organizeImports` feature of the TypeScript language service API.
 *
 * @param {string} code
 * @param {import('prettier').ParserOptions} options
 */
export function organizeImports(code, options) {
	if (code.includes('// organize-imports-ignore') || code.includes('// tslint:disable:ordered-imports')) {
		return code;
	}

	try {
		return organize(code, options);
	} catch (error) {
		if (process.env.DEBUG) {
			console.error(error);
		}

		return code;
	}
};