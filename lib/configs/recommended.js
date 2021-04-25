module.exports = {
  plugins: ['import'],
  extends: ['eslint:recommended', 'plugin:import/errors', 'plugin:import/warnings', 'plugin:unicorn/recommended'],
  rules: {
    // NOTE: Disallow async functions which have no await expression
    'require-await': 'warn',

    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],

    'unicorn/filename-case': [
      'error',
      {
        cases: {
          camelCase: true,
          pascalCase: true,
        },
      },
    ],
    // NOTE: 微妙なケースが多い
    'unicorn/prevent-abbreviations': 'off',
  },
}
