import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import pkg from './package.json'
import replace from 'rollup-plugin-replace'

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
    resolve({ extensions }),
    replace({
      GLOBAL_VERSION: JSON.stringify(pkg.version)
    }),
    commonjs(),
    babel({ extensions, include: ['src/**/*'] })
  ]
}
