<script setup lang="ts">
// 实时数据徽章栏 — Shields.io
// 数据自动从 Shields.io API 获取，无需手动更新
</script>

<template>
  <div class="mp-badge-bar">
    <!-- JetBrains Marketplace -->
    <a href="https://plugins.jetbrains.com/plugin/33633-sql-visualizer" target="_blank" rel="noopener">
      <img
        src="https://img.shields.io/badge/JetBrains-MyBatis--Plus%20SQL%20Visualizer-4285F4?style=flat&logo=jetbrains&logoColor=white"
        alt="JetBrains Plugin"
      />
    </a>
    <!-- 版本号 -->
    <a href="https://plugins.jetbrains.com/plugin/33633-sql-visualizer/versions" target="_blank" rel="noopener">
      <img
        src="https://img.shields.io/jetbrains/plugin/v/33633-mybatis-plus-sql-visualizer?style=flat&color=7c3aed&logo=jetbrains"
        alt="Version"
      />
    </a>
    <!-- 下载量 -->
    <a href="https://plugins.jetbrains.com/plugin/33633-sql-visualizer" target="_blank" rel="noopener">
      <img
        src="https://img.shields.io/jetbrains/plugin/d/33633-mybatis-plus-sql-visualizer?style=flat&color=2563eb&logo=jetbrains"
        alt="Downloads"
      />
    </a>
    <!-- 方言支持（静态；11 种 = 9 + OceanBase/openGauss，T-DialectXcFamily） -->
    <img
      src="https://img.shields.io/badge/dialects-11-3b82f6?style=flat"
      alt="Dialects"
    />
    <!-- 协议 -->
    <img
      src="https://img.shields.io/badge/license-Apache--2.0-f59e0b?style=flat"
      alt="License"
    />
  </div>
</template>
