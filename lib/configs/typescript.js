module.exports = {
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:import/typescript'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'no-undef': 'off',
    'no-unused-vars': 'off',
    'no-useless-constructor': 'off',
    camelcase: 'off',
    strict: 'off',

    'import/no-unresolved': 'off',

    '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
    '@typescript-eslint/no-useless-constructor': 'error',
  },
}
