import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'rollup';

export default defineConfig({
	input: 'src/index.ts',
	plugins: [commonjs(), typescript(), terser()],
	external: ['prettier', 'typescript'],
	output: {
		dir: 'dist',
		format: 'cjs',
		sourcemap: true,
	},
});
