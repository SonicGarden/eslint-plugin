const { fixupConfigRules } = require('@eslint/compat')
const github = require('eslint-plugin-github').default

// NOTE: eslint-plugin-github は ESLint 10 を peerDependencies で宣言しておらず、
// 旧 context API を使うため、@eslint/compat でラップして互換性を確保する。
// TODO: eslint-plugin-github が ESLint 10 を peerDependencies で宣言したら fixupConfigRules を除去する。
module.exports = [
  ...fixupConfigRules([github.getFlatConfigs().browser]),
  {
    rules: {
      'github/async-currenttarget': 'error',
      'github/async-preventdefault': 'error',
      'github/no-innerText': 'error',
      'github/unescaped-html-literal': 'error',
      'github/no-useless-passive': 'error',
      'github/require-passive-events': 'error',
      'github/prefer-observers': 'error',
    },
  },
  {
    files: ['**/*.stories.js', '**/*.stories.ts'],
    rules: {
      'github/unescaped-html-literal': 'off',
    },
  },
]
