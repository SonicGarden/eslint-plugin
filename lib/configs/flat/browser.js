const github = require('eslint-plugin-github')

module.exports = [
  {
    ...github.getFlatConfigs().browser,
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
    files: ['*.stories.js', '*.stories.ts'],
    rules: {
      'github/unescaped-html-literal': 'off',
    },
  },
]
