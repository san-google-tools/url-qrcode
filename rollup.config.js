import path from 'path'

import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

import { chromeExtension, simpleReloader } from 'rollup-plugin-chrome-extension'
import { emptyDir } from 'rollup-plugin-empty-dir'
import replace from '@rollup/plugin-replace'

const isProduction = process.env.NODE_ENV === 'production'
export default {
  input: 'src/manifest.json',
  output: {
    dir: 'dist',
    format: 'esm',
    chunkFileNames: path.join('chunks', '[name]-[hash].js'),
  },
  plugins: [
    chromeExtension({
      extendManifest: {
        manifest_version: 3,
        permissions: ['tabs'],
      },
    }),
    simpleReloader({}, { manifestVersion: 3 }),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    babel({
      ignore: ['node_modules'],
      babelHelpers: 'bundled',
    }),
    resolve(),
    commonjs(),
    emptyDir(),
  ],
}
