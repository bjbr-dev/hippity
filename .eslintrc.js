module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  rules: {
    'prettier/prettier': 'error',
    'no-var': 'error',
    'prefer-const': 'error',

    // TODO: Decide whether to enable these rules, and if so merge all relevant code
    '@typescript-eslint/no-use-before-define': ['error', { functions: false }]
  }
}
