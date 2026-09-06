---
search: false
---

# Cloudflare Worker 跨域 CORS 配置

- 记录时间：2026-09-03 13:00
- 项目：sql-visualizer-admin（Cloudflare Workers + D1 方案）

## 问题描述

管理后台部署在 Cloudflare Pages（`*.pages.dev`），API 部署在 Cloudflare Worker（`*.workers.dev`）。

浏览器控制台报错：
```
Access to fetch at 'https://xxx.workers.dev/api/v1/xxx' from origin 'https://xxx.pages.dev' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present.
```

## 根本原因

浏览器的**同源策略（Same-Origin Policy）**阻止了跨域请求。当 Pages 域名（`*.pages.dev`）向 Worker 域名（`*.workers.dev`）发送请求时，需要在 Worker 响应头中包含 `Access-Control-Allow-Origin`。

## 解决方案

### 基础配置

```typescript
// src/index.ts
app.use('/api/*', cors({
  origin: [
    'https://sql-visualizer-admin.pages.dev',
    'https://admin.sql-visualizer.jvtools.cn',
  ],
  allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));
```

### 动态 Origin 配置（推荐）

Cloudflare Pages 会为每次部署生成不同的子域名（如 `https://b0841b43.sql-visualizer-admin.pages.dev`），硬编码域名无法覆盖所有情况。

```typescript
// 动态允许 *.pages.dev 子域名
app.use('/api/*', async (c, next) => {
  await next();
  const origin = c.req.header('Origin') || '';
  const allowed = ['https://example.com'];
  
  // 允许任何 *.pages.dev 子域名
  if (allowed.includes(origin) || origin.endsWith('.pages.dev')) {
    c.res.headers.set('Access-Control-Allow-Origin', origin);
    c.res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS');
    c.res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
});
```

### 处理 OPTIONS 预检请求

浏览器在发送跨域请求前，会先发送 OPTIONS 预检请求。必须正确处理：

```typescript
app.options('/api/*', (c) => {
  const origin = c.req.header('Origin') || '';
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',  // 缓存预检结果 24 小时
    },
  });
});
```

## 常见踩坑

### 1. Pages 部署 URL 不稳定

每次 `wrangler pages deploy` 会生成新的子域名：
- `https://b0841b43.sql-visualizer-admin.pages.dev`
- `https://f26004cd.sql-visualizer-admin.pages.dev`

**解决**：使用通配符匹配 `*.pages.dev`

### 2. 预检请求失败

如果 OPTIONS 请求返回 404 或没有正确的 CORS 头，浏览器会阻止实际请求。

**解决**：确保 `app.options('/api/*', ...)` 正确配置

### 3. 带 Cookie 的请求

如果请求需要携带 Cookie 或 Authorization 头，需要额外配置：

```typescript
c.res.headers.set('Access-Control-Allow-Credentials', 'true');
```

同时前端 fetch 需要设置：
```javascript
fetch(url, { credentials: 'include' });
```

### 4. Hono 框架的 CORS 中间件

Hono 提供了内置的 CORS 中间件，但需要注意：

```typescript
import { cors } from 'hono/cors';

// 这种方式在动态 origin 场景下可能不够灵活
app.use('/api/*', cors({
  origin: 'https://example.com',  // 只允许特定域名
}));
```

对于需要动态 origin 的场景，建议手动设置响应头。

## 验证方法

```bash
# 测试 CORS 头
curl -I -H "Origin: https://sql-visualizer-admin.pages.dev" \
  https://your-worker.workers.dev/api/health

# 应该看到：
# Access-Control-Allow-Origin: https://sql-visualizer-admin.pages.dev
```

## 经验总结

1. **Cloudflare Pages 的部署 URL 是动态的**，使用 `*.pages.dev` 通配符匹配
2. **必须处理 OPTIONS 预检请求**，否则跨域请求会被阻止
3. **开发环境和生产环境的域名不同**，确保都加入白名单
4. **使用 `Access-Control-Max-Age` 缓存预检结果**，减少 OPTIONS 请求次数
