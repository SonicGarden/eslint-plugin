const eslintPlugin = require('eslint-plugin-eslint-plugin').default
const sg = require('./lib')

const { recommended, prettier } = sg.getFlatConfigs()

module.exports = [
  {
    ignores: ['node_modules/**', 'test/fixtures/**'],
  },
  eslintPlugin.configs.recommended,
  ...recommended,
  ...prettier,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        require: 'readonly',
        module: 'writable',
        process: 'readonly',
        __dirname: 'readonly',
      },
    },
    rules: {
      // NOTE: 本プラグインは CommonJS で記述しているため無効化
      'unicorn/prefer-module': 'off',
      'unicorn/filename-case': [
        'error',
        {
          case: 'kebabCase',
        },
      ],
    },
  },
  {
    // NOTE: テストは ESM (.mjs) で記述する CLI スクリプトなので一部ルールを緩和する
    files: ['test/**/*.mjs'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        process: 'readonly',
        console: 'readonly',
        URL: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
      'unicorn/no-process-exit': 'off',
      'unicorn/consistent-assert': 'off',
      'unicorn/relative-url-style': 'off',
    },
  },
]
