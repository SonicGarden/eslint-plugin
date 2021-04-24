module.exports = {
  extends: ['plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'no-undef': 'off',
    'no-unused-vars': 'off',
    'no-unused-vars': 'off',
    'no-useless-constructor': 'off',
    camelcase: 'off',
    strict: 'off',

    '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
    '@typescript-eslint/no-useless-constructor': 'error',
  },
}
