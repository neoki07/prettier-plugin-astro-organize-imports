const esbuild = require('esbuild')
const path = require('path')

esbuild.build({
  entryPoints: [path.resolve(__dirname, './src/index.js')],
  outfile: path.resolve(__dirname, './dist/index.js'),
  bundle: true,
  platform: 'node',
  target: 'node18.15.0',
  external: ['prettier'],
  minify: process.argv.includes('--minify'),
})
