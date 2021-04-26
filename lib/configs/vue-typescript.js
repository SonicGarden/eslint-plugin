module.exports = {
  extends: ['plugin:vue/recommended', 'plugin:vue-scoped-css/recommended'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  rules: {
    // HTMLタグやwebコンポーネントと区別を付けるためにもPascalCaseの方がリーダブル
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
  },
  overrides: [
    {
      files: ['*.vue'],
      // NOTE: パフォーマンスが悪化するので.vueに限定
      parserOptions: {
        parser: '@typescript-eslint/parser',
        project: './tsconfig.json',
        extraFileExtensions: ['.vue'],
      },
      rules: {
        'import/no-default-export': 'off',
        // NOTE: vueのrefで事故りやすいので条件式の型チェックを厳密に
        '@typescript-eslint/strict-boolean-expressions': [
          'error',
          {
            allowNullableBoolean: true,
            allowNullableString: true,
            allowString: true,
            allowAny: true,
          },
        ],
      },
    },
  ],
}
