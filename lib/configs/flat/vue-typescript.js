const pluginVue = require('eslint-plugin-vue')
const tseslint = require('typescript-eslint')
const vueParser = require('vue-eslint-parser')

// NOTE: この config は recommended / typescript と組み合わせて使う前提。
// import-x/no-default-export の上書きは typescript config が登録する import-x プラグインに依存する。
module.exports = [
  ...pluginVue.configs['flat/recommended'],
  {
    rules: {
      // HTMLタグやwebコンポーネントと区別を付けるためにもPascalCaseの方がリーダブル
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      // TypeScriptの場合型推論任せのほうが書きやすいしdefault指定漏れでトラブることもない
      'vue/require-default-prop': 'off',
      // SEE: https://qiita.com/yoshinbo/items/3436face1a1b02f2542f
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
          },
        },
      ],
    },
  },
  {
    files: ['**/*.vue', '**/*.tsx'],
    // NOTE: パフォーマンスが悪化するのでvueコンポーネントに限定
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        projectService: true,
        extraFileExtensions: ['.vue'],
      },
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
    files: ['**/*.vue'],
    // NOTE: @typescript-eslint プラグインは上の **/*.vue ブロックで登録済みのため省略する
    rules: {
      // NOTE: vueコンポーネントはdefault exportの必要がある
      'import-x/no-default-export': 'off',
      // NOTE: propsのデフォルトにemptyFunction渡すというのはよくやる
      '@typescript-eslint/no-empty-function': ['error', { allow: ['arrowFunctions'] }],
    },
  },
]
