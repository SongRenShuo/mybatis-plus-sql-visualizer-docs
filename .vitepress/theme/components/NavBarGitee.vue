<script setup lang="ts">
// 自定义导航栏 Gitee 图标组件 — 使用标准 img 标签确保可靠渲染
</script>

<template>
  <a
    href="https://gitee.com/songrenshuo/mybatis-plus-sql-visualizer"
    target="_blank"
    rel="noopener noreferrer"
    class="nav-gitee-link"
    title="Gitee"
  >
    <img
      src="https://gitee.com/favicon.ico"
      alt="Gitee"
      width="20"
      height="20"
      class="nav-gitee-icon"
    />
  </a>
</template>

<style scoped>
.nav-gitee-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  transition: background 0.2s;
}

.nav-gitee-link:hover {
  background: var(--bg-hover);
}

.nav-gitee-icon {
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 4px;
}
</style>
