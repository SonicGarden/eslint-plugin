const importX = require('eslint-plugin-import-x')
const unusedImports = require('eslint-plugin-unused-imports')
const tseslint = require('typescript-eslint')

module.exports = [
  ...tseslint.configs.recommended,
  importX.flatConfigs.typescript,
  {
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'off',
      'no-useless-constructor': 'off',
      'no-shadow': 'off',
      camelcase: 'off',
      strict: 'off',

      'import-x/no-unresolved': 'off',
      'import-x/no-default-export': 'error',

      '@typescript-eslint/no-shadow': ['error'],
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/no-useless-constructor': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', disallowTypeAnnotations: false },
      ],
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
        },
      ],

      // SEE: https://github.com/sweepline/eslint-plugin-unused-imports
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
      ],
    },
  },
  {
    files: ['**/*.stories.*'],
    rules: {
      'import-x/no-default-export': 'off',
    },
  },
]
