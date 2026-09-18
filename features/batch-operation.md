# 批量操作参数面板
<GifPlayer src="/demo/batch-operation.gif" alt="批量操作参数面板演示" />

`save` / `updateBatchById` / `saveOrUpdate` 等批量 SQL 按列展开，参数可逐列勾选。

## 触发方式

Wrapper 锚点涉及批量操作时，弹窗自动切换到批量参数面板。

## 支持的批量方法

| 方法 | 类型 | 说明 |
|------|------|------|
| `save` | INSERT | 单条插入 |
| `saveBatch` | INSERT | 批量插入 |
| `updateById` | UPDATE | 按 ID 更新 |
| `updateBatchById` | UPDATE | 批量按 ID 更新 |
| `saveOrUpdate` | UPSERT | 插入或更新（冲突子句按方言渲染） |
| `saveOrUpdateBatch` | UPSERT | 批量插入或更新 |

## 参数面板

### 列级勾选

- INSERT：全列可勾选（自增主键默认不勾选，对齐 MP 运行时行为）
- UPDATE：SET 列可勾选，WHERE 主键 + @Version 固定不可取消
- UPSERT：全列含主键均可勾选

### 引号回填

按字段类型自动决定是否加引号：
- 数值类型（Integer / Long / BigDecimal 等）→ 不加引号
- 字符串 / 时间类型 → 加引号
- 类型未知 → 面板 NUMBER_REGEX 启发式判断

### 冲突子句（UPSERT）

| 方言 | 冲突子句 |
|------|---------|
| MySQL / MariaDB | `ON DUPLICATE KEY UPDATE` |
| PostgreSQL | `ON CONFLICT (key) DO UPDATE SET` |
| SQL Server | `MERGE INTO` |
| Oracle | `MERGE INTO` |

## 批量执行与确认

Log → SQL 还原出的多语句产物一键执行时，单条直通执行，多条会弹候选勾选浮层，确认后再执行。

foreach 批删还原出的多条同表等值删除，确认浮层会附一行合并参考：「检测到 N 条同表等值删除，可合并为 DELETE ... WHERE id IN (...)」。这只是预览参考，实际执行仍逐条原样；混有异构语句时按「N / M 条」如实披露。

> 对批量操作面板有建议或遇到问题？[直达需求反馈池](/about/feedback?category=batch)
