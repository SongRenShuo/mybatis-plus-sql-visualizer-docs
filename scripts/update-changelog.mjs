/**
 * 从 JetBrains Marketplace API 获取插件更新日志
 * 自动生成 docs/about/changelog.md 和 docs/en/about/changelog.md
 *
 * 用法：node scripts/update-changelog.mjs
 * 在 build 前自动运行（npm run prebuild）
 */

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const PLUGIN_ID = '33633';
const API_URL = `https://plugins.jetbrains.com/api/plugins/${PLUGIN_ID}/updates`;
const PLUGIN_PAGE = `https://plugins.jetbrains.com/plugin/33633-sql-visualizer`;

/**
 * 解析 HTML 格式的 changelog notes 为 Markdown
 */
function parseNotes(html) {
  if (!html) return '';
  return html
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n## $1\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n### $1\n')
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1')
    .replace(/<\/?ul[^>]*>/gi, '\n')
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * 格式化 Unix 毫秒时间戳为 YYYY.M.D
 */
function formatDate(timestamp) {
  const d = new Date(parseInt(timestamp));
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
}

/**
 * 标准化版本号（去掉 v 前缀）
 */
function normalizeVersion(v) {
  return v.replace(/^v/, '').trim();
}

async function main() {
  console.log('🔄 正在从 JetBrains Marketplace 获取更新日志...');

  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`API 返回 ${res.status}`);

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) throw new Error('API 返回数据为空');

    // 按版本日期倒序 + 去重（API 可能返回 v 前缀和无前缀的重复条目）
    const seen = new Set();
    const updates = data
      .sort((a, b) => parseInt(b.cdate) - parseInt(a.cdate))
      .filter(item => {
        const key = normalizeVersion(item.version);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

    // 生成中文版
    let zhMd = `# 更新日志\n\n`;
    zhMd += `数据来源：[JetBrains Marketplace](${PLUGIN_PAGE})\n\n`;
    for (const item of updates) {
      const date = formatDate(item.cdate);
      zhMd += `## ${item.version} (${date})\n\n`;
      zhMd += parseNotes(item.notes) + '\n\n';
    }
    zhMd += `---\n\n[查看更多 →](https://gitee.com/songrenshuo/mybatis-plus-sql-visualizer/releases)\n`;

    writeFileSync(resolve(ROOT, 'about/changelog.md'), zhMd, 'utf-8');
    console.log(`✅ 中文版已生成 (${updates.length} 个版本)`);

    // 生成英文版
    let enMd = `# Changelog\n\n`;
    enMd += `Data source: [JetBrains Marketplace](${PLUGIN_PAGE})\n\n`;
    for (const item of updates) {
      const date = formatDate(item.cdate);
      enMd += `## ${item.version} (${date})\n\n`;
      enMd += parseNotes(item.notes) + '\n\n';
    }
    enMd += `---\n\n[View more →](https://gitee.com/songrenshuo/mybatis-plus-sql-visualizer/releases)\n`;

    writeFileSync(resolve(ROOT, 'en/about/changelog.md'), enMd, 'utf-8');
    console.log(`✅ 英文版已生成 (${updates.length} 个版本)`);

  } catch (err) {
    console.error('❌ 获取失败:', err.message);
    console.log('   将使用现有的 changelog.md 文件');
    process.exit(0);
  }
}

main();
