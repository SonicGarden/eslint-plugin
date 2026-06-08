const prettierRecommended = require('eslint-plugin-prettier/recommended')

// NOTE: eslint-plugin-prettier/recommended は eslint-config-prettier を含み、
// 競合するフォーマット系ルールを無効化したうえで prettier/prettier を有効にする。
module.exports = [prettierRecommended]
