const js = require('@eslint/js')
const eslintComments = require('@eslint-community/eslint-plugin-eslint-comments')
const importX = require('eslint-plugin-import-x')
const unicorn = require('eslint-plugin-unicorn').default

module.exports = [
  js.configs.recommended,
  importX.flatConfigs.recommended,
  unicorn.configs.recommended,
  {
    plugins: {
      '@eslint-community/eslint-comments': eslintComments,
    },
    rules: {
      // NOTE: Disallow async functions which have no await expression
      'require-await': 'warn',

      'import-x/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import-x/no-relative-parent-imports': 'error',

      // NOTE: 微妙なケースが多い
      'unicorn/prevent-abbreviations': 'off',
      // NOTE: プロジェクト単位で設定する方が良い
      'unicorn/filename-case': 'off',

      '@eslint-community/eslint-comments/disable-enable-pair': 'off',
      '@eslint-community/eslint-comments/no-aggregating-enable': 'off',
      '@eslint-community/eslint-comments/no-duplicate-disable': 'error',
      '@eslint-community/eslint-comments/no-unlimited-disable': 'error',
      '@eslint-community/eslint-comments/no-unused-disable': 'error',
      '@eslint-community/eslint-comments/no-unused-enable': 'error',

      // SEE: https://github.com/github/eslint-plugin-github/blob/main/lib/configs/recommended.js
      'no-case-declarations': 'error',
      'no-class-assign': 'error',
      'no-compare-neg-zero': 'error',
      'no-cond-assign': 'error',
      'no-console': 'error',
      'no-const-assign': 'error',
      'no-constant-condition': 'error',
      'no-control-regex': 'error',
      'no-debugger': 'error',
      'no-delete-var': 'error',
      'no-dupe-args': 'error',
      'no-dupe-class-members': 'error',
      'no-dupe-keys': 'error',
      'no-duplicate-case': 'error',
      'no-empty': 'error',
      'no-empty-character-class': 'error',
      'no-empty-pattern': 'error',
      'no-ex-assign': 'error',
      'no-extra-boolean-cast': 'error',
      'no-fallthrough': 'error',
      'no-func-assign': 'error',
      'no-global-assign': 'error',
      'no-implicit-globals': 'error',
      'no-implied-eval': 'error',
      'no-inner-declarations': 'error',
      'no-invalid-regexp': 'error',
      'no-invalid-this': 'error',
      'no-irregular-whitespace': 'error',
      'no-new-symbol': 'error',
      'no-obj-calls': 'error',
      'no-octal': 'error',
      'no-redeclare': 'error',
      'no-regex-spaces': 'error',
      'no-return-assign': 'error',
      'no-self-assign': 'error',
      'no-shadow': 'error',
      'no-sparse-arrays': 'error',
      'no-this-before-super': 'error',
      'no-throw-literal': 'error',
      'no-undef': 'error',
      'no-unreachable': 'error',
      'no-unsafe-finally': 'error',
      'no-unsafe-negation': 'error',
      'no-unused-labels': 'error',
      'no-unused-vars': 'error',
      'no-useless-concat': 'error',
      'no-useless-escape': 'error',
      'no-var': 'error',
      'object-shorthand': ['error', 'always', { avoidQuotes: true }],
      'prefer-const': 'error',
      'prefer-promise-reject-errors': 'error',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'prefer-template': 'error',
      'require-yield': 'error',
      'use-isnan': 'error',
      'valid-typeof': 'error',
      camelcase: ['error', { properties: 'always' }],
      eqeqeq: 'error',

      // SEE: https://github.com/cybozu/eslint-config/blob/master/lib/base.js
      // Best Practices
      'default-param-last': 'error',
      'no-caller': 'error',
      'no-eval': 'error',
      'no-extend-native': 'error',
      'no-floating-decimal': 'error',
      'no-iterator': 'error',
      'no-lone-blocks': 'error',
      'no-new-func': 'error',
      'no-new-wrappers': 'error',
      'no-octal-escape': 'error',
      'no-proto': 'error',
      'no-return-await': 'error',
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
        },
      ],
      'no-void': 'error',
      'no-with': 'error',
      'prefer-regex-literals': 'error',
      radix: 'error',
      'wrap-iife': ['error', 'any'],
      'no-async-promise-executor': 'error',
      'no-extra-parens': ['error', 'functions'],
      'no-import-assign': 'error',
      'require-atomic-updates': 'error',
      // Variables
      'no-catch-shadow': 'error',
      'no-label-var': 'error',
      'no-shadow-restricted-names': 'error',

      // ECMAScript6
      'generator-star-spacing': ['error', 'after'],
      'no-confusing-arrow': [
        'error',
        {
          allowParens: true,
        },
      ],
      'no-useless-computed-key': 'error',
      'no-useless-rename': 'error',
      'prefer-numeric-literals': 'error',
      'symbol-description': 'error',
      'template-curly-spacing': 'error',
      'yield-star-spacing': ['error', 'after'],
    },
  },
]
