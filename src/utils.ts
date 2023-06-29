import type { Plugin } from "prettier";

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
