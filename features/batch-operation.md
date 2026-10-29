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

`saveOrUpdateBatch` 的列级勾选与冲突子句是联动的：在左栏「参数列」取消勾选一列，INSERT 的列清单与 `ON DUPLICATE KEY UPDATE` 段会同步少掉那一列。

<GifPlayer src="/demo/batch-columns.gif" alt="批量参数面板的列级勾选：saveOrUpdateBatch 预览先渲染 INSERT INTO user (id, password, age, email, role_id, dept_id, status, username, …) 与 ON DUPLICATE KEY UPDATE password = VALUES(password), age = VALUES(age), email = VALUES(email), …；在左栏「参数列」取消勾选 email 后，INSERT 列清单与 ON DUPLICATE KEY UPDATE 段同步去掉 email，复选框恢复为未勾选、按钮由「全不选」变「全选」" />

### 引号回填

按字段类型自动决定是否加引号：
- 数值类型（Integer / Long / BigDecimal 等）→ 不加引号
- 字符串 / 时间类型 → 加引号
- 类型未知 → 面板 NUMBER_REGEX 启发式判断

### 冲突子句（UPSERT）

| 方言 | 冲突子句 |
|------|---------|
| MySQL / MariaDB / OceanBase（MySQL 模式） | `ON DUPLICATE KEY UPDATE` |
| openGauss / GaussDB | `ON DUPLICATE KEY UPDATE`（不是 PG 的 `ON CONFLICT`） |
| PostgreSQL / KingBase（金仓）/ SQLite | `ON CONFLICT (key) DO UPDATE SET` |
| H2 | 整语句 `MERGE INTO t (cols) KEY (key) VALUES (...)` |
| Oracle / SQL Server / DM（达梦） | 无原生简洁形态，降级纯 INSERT |

SQL Server、Oracle 与达梦虽然支持 `MERGE INTO`，但那是完整的多分支语句形态，无法作为 INSERT 的冲突后缀追加，因此这里选择输出一条在本方言可执行的纯 INSERT，而不是拼一条形态不完整的 MERGE。

## 批量执行与确认

Log → SQL 还原出的多语句产物一键执行时，单条直通执行，多条会弹候选勾选浮层，确认后再执行。

foreach 批删还原出的多条同表等值删除，确认浮层会附一行合并参考：「检测到 N 条同表等值删除，可合并为 DELETE ... WHERE id IN (...)」。这只是预览参考，实际执行仍逐条原样；混有异构语句时按「N / M 条」如实披露。

## FieldFill 安全模拟

实体字段带 `@TableField(fill = INSERT / UPDATE / INSERT_UPDATE)` 时，参数区该字段名后会出现 `[fill=…]` 角标，说明运行时 `MetaObjectHandler` 会往这一列写值：

<GifPlayer src="/demo/fieldfill-simulate.gif" alt="FieldFill 安全模拟：勾选「FieldFill 安全模拟」后，带 [fill=INSERT] 角标的字段下方出现「模拟值」输入行；填入值后 SQL 里该列取模拟值、同字段的普通参数框置灰" />

- **模拟值行只在勾选「FieldFill 安全模拟」时出现**（勾选框默认关闭），角标则一直显示，用来提示「这一列运行时不是由你填的」
- 填了模拟值后**模拟值优先**，同一字段的普通参数框置灰；清空模拟值即可改回手填
- 只适配活跃的 INSERT / UPDATE 写列；**WHERE 条件与 UPSERT 不猜填**
- 数值列只接受数字，不接受分号或脚本；输入无效时保留占位符并提示

**说清楚边界**：模拟只用于预览，**不会执行你的 `MetaObjectHandler`**——它按你手填的内容拼 SQL，所以结果可能与真实运行时不同。要精确对齐，还得看应用真实执行（见 [SQL 日志工具窗口](./sql-log) 的增强捕获）。

> 对批量操作面板有建议或遇到问题？[直达需求反馈池](/about/feedback?category=batch)
