import type { AstPath } from 'prettier';

/**
 * Print the AST node.
 *
 * @param {AstPath} path
 */
export function print(path: AstPath) {
	const node = path.getValue();
	if (!node) {
		return '';
	}

	if (typeof node === 'string') {
		return node;
	}

	throw new Error(`Unknown node type: ${node.type}`);
}
