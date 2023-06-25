import prettier from 'prettier';
import { fileURLToPath } from 'url';
import { expect, it } from 'vitest';

/**
 * format the contents of an astro file
 */
export function format(contents: string, options: prettier.Options = {}): string {
	try {
		return prettier.format(contents, {
			parser: 'astro',
			plugins: [fileURLToPath(new URL('../', import.meta.url).toString())],
			...options,
		});
	} catch (e) {
		if (e instanceof Error) {
			throw e;
		}
		if (typeof e === 'string') {
			throw new Error(e);
		}
	}
	return '';
}

/**
 * Utility to get `[input, output]` files
 */
function getFiles(file: any, path: string) {
	const ext = 'astro';
	let input: string = file[`/test/fixtures/${path}/input.${ext}`];
	let output: string = file[`/test/fixtures/${path}/output.${ext}`];
	// workaround: normalize end of lines to pass windows ci
	if (input) input = input.replace(/(\r\n|\r)/gm, '\n');
	if (output) output = output.replace(/(\r\n|\r)/gm, '\n');
	return { input, output };
}

function getOptions(files: any, path: string) {
	if (files[`/test/fixtures/${path}/options.js`] !== undefined) {
		return files[`/test/fixtures/${path}/options.js`].default;
	}

	let opts: object;
	try {
		opts = JSON.parse(files[`/test/fixtures/${path}/options.json`]);
	} catch (e) {
		opts = {};
	}
	return opts;
}

/**
 * @param {string} name Test name.
 * @param {any} files Files from import.meta.glob.
 * @param {string} path Fixture path.
 */
export function test(name: string, files: any, path: string) {
	it(`${path}\n${name}`, async () => {
		const { input, output } = getFiles(files, path);

		expect(input, 'Missing input file').to.not.be.undefined;
		expect(output, 'Missing output file').to.not.be.undefined;

		const opts = getOptions(files, path);

		const formatted = format(input, opts);
		const formattedBuffer = Buffer.from(formatted);
		const outputBuffer = Buffer.from(output);

		if (Buffer.compare(formattedBuffer, outputBuffer) !== 0) {
			console.log('formatted:', formattedBuffer);
			console.log('output:', outputBuffer);
			throw new Error('Buffers are not equal');
		}

		expect(formatted, 'Incorrect formatting').toBe(output);

		// test that our formatting is idempotent
		const formattedTwice = format(formatted, opts);
		const formattedTwiceBuffer = Buffer.from(formattedTwice);

		if (Buffer.compare(formattedTwiceBuffer, outputBuffer) !== 0) {
			console.log('formatted(twice):', formattedTwiceBuffer);
			console.log('output:', outputBuffer);
			throw new Error('Buffers are not equal');
		}
		expect(formatted === formattedTwice, 'Formatting is not idempotent').toBe(true);
	});
}
