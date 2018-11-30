module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module'
  },
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    'jest/globals': true
  },
  extends: ['standard', 'plugin:prettier/recommended'],
  plugins: ['jest'],
  globals: {},
  rules: {
    quotes: ['error', 'single', { avoidEscape: true }]
  }
}
