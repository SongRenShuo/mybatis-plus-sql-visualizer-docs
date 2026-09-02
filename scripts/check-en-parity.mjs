#!/usr/bin/env node
/**
 * 中英内容一致性校验
 * 对比根目录与 en/ 下的页面清单，输出缺失/多余项
 * 用法：node scripts/check-en-parity.mjs
 */
import { readdirSync, statSync, existsSync } from 'node:fs'
import { join, relative, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const sections = ['features', 'guide', 'about']
const missing = []

function listPages(dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) {
      out.push(...listPages(full).map((p) => `${name}/${p}`))
    } else if (name.endsWith('.md')) {
      out.push(name)
    }
  }
  return out
}

for (const section of sections) {
  const zhDir = join(root, section)
  const enDir = join(root, 'en', section)
  if (!existsSync(enDir)) {
    missing.push(`en/${section}/ 整个目录不存在`)
    continue
  }
  const zhPages = listPages(zhDir)
  const enPages = new Set(listPages(enDir))
  for (const page of zhPages) {
    if (!enPages.has(page)) missing.push(`en/${section}/${page} 缺失`)
  }
  for (const page of enPages) {
    if (!zhPages.includes(page)) missing.push(`en/${section}/${page} 中文版不存在（疑似多余）`)
  }
}

if (!existsSync(join(root, 'en', 'index.md'))) {
  missing.push('en/index.md 缺失')
}

if (missing.length === 0) {
  console.log('[check-en-parity] 中英页面清单一致')
} else {
  console.log('[check-en-parity] 发现 %d 处不一致：', missing.length)
  for (const item of missing) console.log('  - ' + item)
  process.exitCode = 1
}
