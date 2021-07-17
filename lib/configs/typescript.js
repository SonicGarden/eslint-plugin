module.exports = {
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:import/typescript'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'no-undef': 'off',
    'no-unused-vars': 'off',
    'no-useless-constructor': 'off',
    'no-shadow': 'off',
    camelcase: 'off',
    strict: 'off',

    'import/no-unresolved': 'off',
    'import/no-default-export': 'error',

    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
    '@typescript-eslint/no-useless-constructor': 'error',
  },
  overrides: [
    {
      files: ['**/*.stories.*'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
  ],
}
