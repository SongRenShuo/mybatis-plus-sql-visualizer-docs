---
search: false
---

# SQL Visualizer — 官网文档站

SQL Visualizer 插件的官网与文档站，基于 [VitePress](https://vitepress.dev/) 构建。

## 产品首页

Wrapper 链、XML/注解动态 SQL 实时预览（含 MPJ 联表 JOIN），控制台日志一键还原，SQL 反向转 Java 代码。

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器（带 API 代理）
npm run dev

# 构建
npm run build

# 预览构建产物
npm run preview
```

## 部署

部署到 Cloudflare Pages：

1. 连接 Git 仓库
2. Build command: `npm run build`
3. Build output: `.vitepress/dist`

动态更新日志通过 Cloudflare Pages Function 代理 JetBrains Marketplace API（解决跨域）。

## 文档结构

```
/
├── index.md                        — 首页（中文默认）
├── features/                       — 功能详解（6 篇）
├── guide/                          — 使用指南（3 篇）
├── about/                          — 关于 & 更新日志 & 开发路线
├── en/                             — 英文版（完整翻译）
├── functions/api/changelog.js      — 更新日志 API 代理
└── public/                         — 静态资源 & GIF 占位图
```

## 相关链接

- 源码仓库（主仓）：https://gitee.com/songrenshuo/mybatis-plus-sql-visualizer
- 源码仓库（GitHub 镜像）：https://github.com/SongRenShuo/mybatis-plus-sql-visualizer
- 插件市场：https://plugins.jetbrains.com/plugin/33633-sql-visualizer
- 开源协议：Apache-2.0
