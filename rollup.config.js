import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import pkg from './package.json'

const extensions = ['.js', '.jsx', '.ts', '.tsx']

const libraryName = '@berkeleybross/restclient'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      name: libraryName,
      format: 'umd',
      sourcemap: true,
      globals: { axios: 'axios' }
    },
    { file: pkg.module, format: 'es', sourcemap: true }
  ],

  // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
  external: ['axios'],

  plugins: [
    resolve({ extensions }),
    babel({ extensions, include: ['src/**/*'] })
  ]
}
