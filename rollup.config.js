import autoExternal from 'rollup-plugin-auto-external'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import pkg from './package.json'

const extensions = ['.js', '.jsx']

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      name: pkg.name,
      format: 'umd',
      sourcemap: true,
      globals: {}
    },
    { file: pkg.module, format: 'es', sourcemap: true }
  ],

  // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
  external: [],

  plugins: [
    autoExternal(),
    resolve({ extensions }),
    replace({
      'process.env.HIPPITY_VERSION': JSON.stringify(pkg.version)
    }),
    commonjs(),
    babel({ extensions, include: ['src/**/*'] })
  ]
}
