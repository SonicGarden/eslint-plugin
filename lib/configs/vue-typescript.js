module.exports = {
  extends: ['plugin:vue/recommended'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  rules: {
    // HTMLタグやwebコンポーネントと区別を付けるためにもPascalCaseの方がリーダブル
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    // TypeScriptの場合型推論任せのほうが書きやすいしdefault指定漏れでトラブることもない
    'vue/require-default-prop': 'off',
  },
  overrides: [
    {
      files: ['*.vue', '*.tsx'],
      // NOTE: パフォーマンスが悪化するのでvueコンポーネントに限定
      parserOptions: {
        parser: '@typescript-eslint/parser',
        project: './tsconfig.json',
        extraFileExtensions: ['.vue'],
      },
      rules: {
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
    {
      files: ['*.vue'],
      rules: {
        // NOTE: vueコンポーネントはdefault exportの必要がある
        'import/no-default-export': 'off',
        // NOTE: propsのデフォルトにemptyFunction渡すというのはよくやる
        '@typescript-eslint/no-empty-function': ['error', { allow: ['arrowFunctions'] }],
      },
    },
  ],
}
