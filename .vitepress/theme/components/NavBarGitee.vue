<script setup lang="ts">
// 自定义导航栏源码仓库图标组（Gitee 主仓 + GitHub 镜像）— 使用标准 img 标签确保可靠渲染。
// 2026-10-22 双仓：Gitee 是主仓、GitHub 是镜像且承担 Marketplace 源码链接，两者并列展示。
// 图标走本地 public/ 而非外链 favicon——外链受 Gitee 防盗链与网络抖动影响，且与首页 NavHeader
// 的本地图标不一致（本组件此前用 https://gitee.com/favicon.ico，首页用 /gitee-icon.png）。
</script>

<template>
  <span class="nav-repo-group">
    <a
      href="https://gitee.com/songrenshuo/mybatis-plus-sql-visualizer"
      target="_blank"
      rel="noopener noreferrer"
      class="nav-repo-link"
      title="Gitee（主仓）"
    >
      <img
        src="/gitee-icon.png"
        alt="Gitee"
        width="20"
        height="20"
        class="nav-repo-icon"
      />
    </a>
    <a
      href="https://github.com/SongRenShuo/mybatis-plus-sql-visualizer"
      target="_blank"
      rel="noopener noreferrer"
      class="nav-repo-link"
      title="GitHub（镜像）"
    >
      <img
        src="/github-icon.png"
        alt="GitHub"
        width="20"
        height="20"
        class="nav-repo-icon"
      />
    </a>
  </span>
</template>

<style scoped>
.nav-repo-group {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  margin-right: 4px;
}

.nav-repo-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  transition: background 0.2s;
}

.nav-repo-link:hover {
  background: var(--bg-hover);
}

.nav-repo-icon {
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 4px;
}
</style>
