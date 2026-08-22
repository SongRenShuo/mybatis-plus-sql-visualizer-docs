# SQL 日志工具窗口
<GifPlayer src="/demo/placeholder.svg" alt="Demo" />

自动捕获运行控制台的 `Preparing:` / `Parameters:` 日志，还原成可执行 SQL。

## 触发方式

侧边栏「MyBatis SQL Log」工具窗口 → 点击「捕捉」按钮开始监听。

## 功能特性

### 自动捕获

监听运行控制台的日志输出，识别 `Preparing:` 和 `Parameters:` 行，自动还原成完整 SQL。

### 混合前缀匹配

支持多种日志格式：
- `Preparing: SELECT ...`（MyBatis 默认）
- `==> Preparing: SELECT ...`（Spring Boot）
- 自定义前缀（设置页配置）

### 日志 → SQL

侧边栏「Log → SQL」tab：粘贴整段日志批量还原，多组语句自动分隔。

### 去重与过滤

| 功能 | 说明 |
|------|------|
| 去重窗口 | 相同 SQL 在窗口内重复不显示（默认 60000ms，可调） |
| 关键字过滤 | 移除包含指定关键字的日志行 |
| 时间戳显示 | 条目列表显示捕获时间 |

### 双击预览

双击日志条目 → 弹出 SQL 预览弹窗（同 Wrapper 预览弹窗，支持参数回填和格式化）。

