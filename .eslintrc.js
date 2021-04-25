module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2020,
  },
  env: {
    es6: true,
    node: true,
  },
  extends: ['plugin:eslint-plugin/all', './lib/configs/recommended', './lib/configs/prettier'],
  plugins: ['eslint-plugin', 'prettier'],
  rules: {
    'eslint-plugin/prefer-placeholders': 'off',
    'eslint-plugin/test-case-shorthand-strings': 'off',
    'eslint-plugin/require-meta-docs-url': 'off',

    'unicorn/prefer-module': 'off',
    'unicorn/filename-case': [
      'error',
      {
        case: 'kebabCase',
      },
    ],
  },
}
