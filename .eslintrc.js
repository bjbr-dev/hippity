module.exports = {
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  env: {
    browser: true,
    node: true,
    es6: true
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  rules: {
    'prettier/prettier': 'error',
    'no-var': 'error',
    'prefer-const': 'error'
  },
  overrides: [
    {
      files: '*.test.js',
      plugins: ['jest'],
      extends: ['plugin:jest/recommended']
    }
  ]
}
