module.exports = {
  plugins: ['github'],
  env: {
    browser: true,
  },
  rules: {
    'github/async-currenttarget': 'error',
    'github/async-preventdefault': 'error',
    'github/no-innerText': 'error',
    'github/unescaped-html-literal': 'error',
    'github/no-useless-passive': 'error',
    'github/require-passive-events': 'error',
    'github/prefer-observers': 'error',
  },
  overrides: [
    {
      files: ['*.stories.js', '*.stories.ts'],
      rules: {
        'github/unescaped-html-literal': 'off',
      },
    },
  ],
}
