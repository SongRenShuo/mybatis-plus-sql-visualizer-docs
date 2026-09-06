// pagefind 索引前：给内部页 HTML 注入 data-pagefind-ignore，将其整体排除出搜索索引。
// 内部页 = docs/ 下开发计划/发行说明/开发笔记 + README.html（仓库说明的构建产物）。
// 实测 pagefind 1.5.2 不读取 .pagefindignore 文件（site 根与 CWD 放置均无效），改用
// 官方文档推荐的属性方案：pagefind 对带 data-pagefind-ignore 的节点忽略整个子树，
// 加在 <body> 上即整页无内容、不进索引。VitePress frontmatter 的 search:false 只作用于
// 内置 local search，与此互不相干。Cloudflare Pages 部署照常提供这些页面，只是不可被搜索。
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const dist = new URL('../.vitepress/dist/', import.meta.url).pathname.replace(/^\/(\w:)/, '$1')

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) yield* walk(p)
    else if (p.endsWith('.html')) yield p
  }
}

let count = 0
const docsDir = join(dist, 'docs')
const targets = [...walk(docsDir)]
const readme = join(dist, 'README.html')
try {
  if (statSync(readme).isFile()) targets.push(readme)
} catch {}

for (const file of targets) {
  const html = readFileSync(file, 'utf-8')
  // 已标记检测必须针对 body 标签：部分内部页正文文字里就含 data-pagefind-ignore
  // 字面量（如本方案的调研报告），整串 includes 会把待处理页误判为已处理而跳过
  if (/<body[^>]*data-pagefind-ignore/.test(html)) continue
  if (!html.includes('<body>')) {
    console.warn(`[prepare-pagefind] 未找到 <body>，跳过: ${file}`)
    continue
  }
  writeFileSync(file, html.replace('<body>', '<body data-pagefind-ignore>'))
  count++
}
console.log(`[prepare-pagefind] ${count} 个内部页已标记 data-pagefind-ignore`)
