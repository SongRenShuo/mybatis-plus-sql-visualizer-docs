<script setup>
// 英文首页 Feature Matrix 三组表格（替代 en/index.md 中的三张 markdown 表）
// 全部样式沿用 VitePress vp-doc 全局表格/行内代码/标题锚点样式，观感与原 markdown 一致。
// 数据来源：theme/data/homeHighlights.js 的 enFeatureMatrix
import { enFeatureMatrix } from '../../data/homeHighlights.js'

// 按 `反引号` 拆分单元格，奇数位渲染为 <code>，文本位经插值自动转义
function cellParts(cell) {
  return String(cell)
    .split('`')
    .map((text, index) => ({ code: index % 2 === 1, text }))
    .filter((part) => part.text !== '')
}
</script>

<template>
  <div class="en-feature-matrix">
    <div v-for="group in enFeatureMatrix" :key="group.anchor" class="matrix-group">
      <h3 :id="group.anchor" tabindex="-1">
        {{ group.title }}
        <a
          class="header-anchor"
          :href="`#${group.anchor}`"
          :aria-label="`Permalink to '${group.title}'`"
          >&#8203;</a
        >
      </h3>
      <table tabindex="0">
        <thead>
          <tr>
            <th v-for="head in group.headers" :key="head">{{ head }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in group.rows" :key="rowIndex">
            <td v-for="(cell, colIndex) in row" :key="colIndex">
              <template v-for="(part, partIndex) in cellParts(cell)" :key="partIndex">
                <code v-if="part.code">{{ part.text }}</code>
                <template v-else>{{ part.text }}</template>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
