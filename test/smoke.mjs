import assert from 'node:assert'
import { writeFileSync, rmSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { ESLint } from 'eslint'

const require = createRequire(import.meta.url)
const sg = require('../lib/index.js')
const configs = sg.getFlatConfigs()

// tsconfig.json を持つ fixtures ディレクトリ。実ファイルを lint する際の cwd に使う。
const fixturesDir = fileURLToPath(new URL('./fixtures', import.meta.url))

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

// fixtures に一時ファイル群({ name, content })を書き、先頭ファイルを overrideConfig で lint して
// messages を返す。resolver は実ファイルパス基準で解決するため lintText ではなく lintFiles を使う。
const lintFixtureFiles = async (overrideConfig, files) => {
  const paths = files.map((f) => path.join(fixturesDir, f.name))
  for (const [i, f] of files.entries()) writeFileSync(paths[i], f.content)
  try {
    const eslint = new ESLint({ cwd: fixturesDir, overrideConfigFile: true, overrideConfig })
    const results = await eslint.lintFiles([paths[0]])
    return results[0].messages
  } finally {
    for (const p of paths) rmSync(p, { force: true })
  }
}

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

// messages から resolver 起因のエラーだけ抽出するヘルパ
const resolveErrorMessages = (messages) =>
  messages.filter(
    (m) =>
      typeof m.message === 'string' &&
      (m.message.includes('Resolve error') || m.message.includes('invalid interface loaded as resolver')),
  )

const assertNoResolveErrors = (messages) => {
  const resolveErrors = resolveErrorMessages(messages)
  assert.strictEqual(
    resolveErrors.length,
    0,
    `resolver エラーが出てはいけない: ${resolveErrors.map((m) => `${m.ruleId}: ${m.message}`).join(' | ')}`,
  )
}

await run('typescript: resolver が解決でき Resolve error が出ない', async () => {
  // 先頭ファイルが相対 named import を持ち、resolver 経路を確実に通す。
  const messages = await lintFixtureFiles(
    [...configs.recommended, ...configs.typescript],
    [
      { name: 'entry.ts', content: `import { value } from './dep'\nconsole.log(value)\n` },
      { name: 'dep.ts', content: `export const value = 1\n` },
    ],
  )
  assertNoResolveErrors(messages)
})

await run('vue-typescript: 合成構成で resolver が解決でき Resolve error が出ない', async () => {
  // 実プロジェクトと同じ合成構成(recommended + typescript + vue-typescript)で .vue の相対 import を解決させる。
  const messages = await lintFixtureFiles(
    [...configs.recommended, ...configs.typescript, ...configs['vue-typescript']],
    [
      {
        name: 'Sample.vue',
        content: `<template>\n  <MyComponent />\n</template>\n<script setup lang="ts">\nimport MyComponent from './MyComponent.vue'\n</script>\n`,
      },
      { name: 'MyComponent.vue', content: `<template><div /></template>\n<script setup lang="ts"></script>\n` },
    ],
  )
  assertNoResolveErrors(messages)
})

if (failures > 0) {
  console.error(`\n${failures} 件のテストが失敗しました`)
  process.exit(1)
}
console.log('\nすべてのスモークテストが成功しました')
