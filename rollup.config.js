import babel from 'rollup-plugin-babel'

let pkg = require('./package.json')
let external = Object.keys(pkg.dependencies)

export default {
  input: 'src/index.js',
  plugins: [babel()],
  external: external,
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: 'rollupStarterProject',
      sourceMap: true
    },
    {
      file: pkg.module,
      format: 'es',
      sourceMap: true
    }
  ]
}
