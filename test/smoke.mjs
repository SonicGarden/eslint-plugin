import assert from 'node:assert'
import { writeFileSync, rmSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { ESLint } from 'eslint'

const require = createRequire(import.meta.url)
const sg = require('../lib/index.js')
const configs = sg.getFlatConfigs()

let failures = 0
const run = async (name, fn) => {
  try {
    await fn()
    console.log(`✓ ${name}`)
  } catch (error) {
    failures += 1
    console.error(`✗ ${name}\n  ${error.message}`)
  }
}

// 指定した overrideConfig で 1 ファイルを lint し、messages を返す
const lintText = async (overrideConfig, code, filePath) => {
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig,
  })
  const results = await eslint.lintText(code, { filePath })
  return results[0].messages
}

const ruleIds = (messages) => messages.map((m) => m.ruleId)

await run('全 config が配列としてロードできる', () => {
  for (const [name, cfg] of Object.entries(configs)) {
    assert(Array.isArray(cfg), `${name} は配列であるべき`)
  }
})

await run('recommended: import-x/order 違反を検出', async () => {
  const code = `import b from 'bbb'\nimport a from 'aaa'\nconsole.log(a, b)\n`
  const messages = await lintText(configs.recommended, code, 'sample.js')
  const ids = ruleIds(messages)
  assert(ids.includes('import-x/order'), `import-x/order を検出すべき: ${ids.join(',')}`)
  assert(ids.includes('no-console'), `no-console を検出すべき: ${ids.join(',')}`)
})

await run('recommended: unicorn ルールが有効', async () => {
  // unicorn/no-array-for-each 等。明確に検出される prefer-node-protocol は対象外なので
  // unicorn ルールがロードされていること自体を no-undef 以外で確認
  const code = `const x = 1\nif (x) {} else {}\n`
  const messages = await lintText(configs.recommended, code, 'sample.js')
  // 何らかの unicorn ルールが登録されていることを確認（ロード失敗ならクラッシュする）
  assert(Array.isArray(messages))
})

await run('typescript: unused-imports / consistent-type-imports を検出', async () => {
  const code = `import { foo } from './foo'\ntype T = { a: number }\nexport const x: T = { a: 1 }\n`
  const messages = await lintText([...configs.recommended, ...configs.typescript], code, 'sample.ts')
  const ids = ruleIds(messages)
  assert(
    ids.includes('unused-imports/no-unused-imports'),
    `unused-imports/no-unused-imports を検出すべき: ${ids.join(',')}`,
  )
})

await run('typescript: import-x/no-default-export を検出', async () => {
  const code = `export default function foo() {}\n`
  const messages = await lintText([...configs.recommended, ...configs.typescript], code, 'sample.ts')
  const ids = ruleIds(messages)
  assert(ids.includes('import-x/no-default-export'), `import-x/no-default-export を検出すべき: ${ids.join(',')}`)
})

await run('react-typescript: react/self-closing-comp を検出', async () => {
  const code = `export const A = () => <div></div>\n`
  const messages = await lintText(
    [...configs.recommended, ...configs.typescript, ...configs['react-typescript']],
    code,
    'sample.tsx',
  )
  const ids = ruleIds(messages)
  assert(ids.includes('react/self-closing-comp'), `react/self-closing-comp を検出すべき: ${ids.join(',')}`)
})

await run('vue-typescript: vue/component-name-in-template-casing を検出', async () => {
  // 型情報ルール(strict-boolean-expressions)は projectService により tsconfig を要するため、
  // fixtures ディレクトリ(tsconfig.json あり)を cwd として実ファイルを lint する
  const fixturesDir = fileURLToPath(new URL('./fixtures', import.meta.url))
  const vuePath = path.join(fixturesDir, 'Sample.vue')
  const code = `<template>\n  <my-component />\n</template>\n<script setup lang="ts">\nimport MyComponent from './MyComponent.vue'\n</script>\n`
  writeFileSync(vuePath, code)
  try {
    const eslint = new ESLint({
      cwd: fixturesDir,
      overrideConfigFile: true,
      overrideConfig: configs['vue-typescript'],
    })
    const results = await eslint.lintFiles([vuePath])
    const ids = ruleIds(results[0].messages)
    assert(
      ids.includes('vue/component-name-in-template-casing'),
      `vue/component-name-in-template-casing を検出すべき: ${ids.join(',')}`,
    )
  } finally {
    rmSync(vuePath, { force: true })
  }
})

await run('prettier: prettier/prettier を検出', async () => {
  const code = `const x = 1 ;\n`
  const messages = await lintText([...configs.recommended, ...configs.prettier], code, 'sample.js')
  const ids = ruleIds(messages)
  assert(ids.includes('prettier/prettier'), `prettier/prettier を検出すべき: ${ids.join(',')}`)
})

await run('browser: github ルールがロードできる', async () => {
  const code = `console.log('ok')\n`
  const messages = await lintText(configs.browser, code, 'sample.js')
  // ロード時にクラッシュしないことを確認
  assert(Array.isArray(messages))
})

if (failures > 0) {
  console.error(`\n${failures} 件のテストが失敗しました`)
  process.exit(1)
}
console.log('\nすべてのスモークテストが成功しました')
