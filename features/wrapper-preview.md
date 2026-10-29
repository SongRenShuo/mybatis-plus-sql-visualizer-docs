# Wrapper → SQL 预览

<GifPlayer src="/demo/wrapper-preview.gif" alt="Wrapper → SQL 预览演示" />

把 Java 源码中的 MyBatis-Plus / MPJ 调用**静态解析为可预览 SQL**——无需启动项目、无需连接数据库。

## 触发方式

| 方式 | 操作 |
|------|------|
| gutter 图标 | Wrapper 锚点行左侧图标，**左键**直接弹出 SQL 预览；**右键**弹菜单可选「预览 SQL」或「最近执行记录」 |
| 右键菜单 | 光标置于 Wrapper 上 → 右键 → `Convert to SQL` |
| 快捷键 | `Alt+Shift+Q`（macOS `Option+Shift+Q`） |

其他预览图标（注解 SQL、XML、JPA/HQL 等）仍是单击直接预览。

## 支持的 Wrapper 类型

- `LambdaQueryWrapper` / `LambdaUpdateWrapper` / `LambdaDeleteWrapper`
- 字符串版 `QueryWrapper` / `UpdateWrapper` / `DeleteWrapper`
- `MPJLambdaWrapper` / `MPJQueryWrapper` 联表查询
- `service.lambdaQuery()` / `service.lambdaUpdate()` 等服务链

## 支持的其他 ORM / JDBC 写法

同样以行内 gutter 图标触发，预览体验一致：

| 写法 | 示例 |
|------|------|
| [JdbcTemplate](https://docs.spring.io/spring-framework/reference/data-access/jdbc/core.html) 字符串 SQL | `jdbcTemplate.queryForList("select * from user where id = ?", 1L)`，命名参数 `:name` 按名回填，`StringBuilder` 拼接自动聚合 |
| 自研 DAO 字符串 SQL | `beanCruder.selectList(User.class, "select ...")` 等字符串实参调用行出图标；方法定义名行（方法体内有此类调用）同样出图标 |
| [xbatis](https://xbatis.cn/)（原 mybatis-mp） | `QueryChain.of(userDao, UserEntity.class).eq(UserEntity::getStatus, 1).toList()` |
| [Easy-Query](https://www.easy-query.com/)（proxy 风格） | `easyEntityQuery.queryable(Topic.class).where(o -> o.id().eq("123")).toList()` |
| [MyBatis Dynamic SQL](https://mybatis.org/mybatis-dynamic-sql/) | `SelectDSL.select(...).from(userTable).where(id, isEqualTo(1)).build().render(...)` |
| [Querydsl](https://github.com/querydsl/querydsl) | `queryFactory.selectFrom(QUser.user).where(QUser.user.status.eq(1)).fetch()` |

以上均为第一阶段支持（MVP）：常见链式查询已覆盖，个别冷门方法形态以插件实际识别为准。

## 功能特性

### 动态条件勾选

`.eq(true, ...)` 等布尔重载条件可在左侧面板勾选/取消，SQL 实时重渲染。

<GifPlayer src="/demo/wrapper-params.gif" alt="预览面板动态条件取消勾选 username 后 WHERE 实时少一个条件，勾回还原；参数框填值（tom / 1，不带引号）后 ? 即时替换为 'tom' / 1——引号由插件按字段类型决定" />

### 参数回填

- `?` 占位符替换为实际值
- LIKE 参数自动拼百分号，`LIKE '%value%'`
- 按字段类型决定是否加引号（数值类型不加引号，字符串加引号）
- 配置数据源后可按数据源真实列集合校正列名（设置页「按数据源校正列名」，默认开）

::: details 列名校正边界（何时看：实体字段名与库列名不一致时）
实体字段名与库真实列名不一致（字段 `orderID`、列为 `order_id`）时，仅在能唯一确定是哪一列才改写，歧义保持原样；无可用数据源时与关闭该开关完全一致。
:::

#### 参数预设与参数历史

参数区支持保存具名参数组合（「管理预设」），填过的值也会被自动记住（「默认预设」）。这两类记忆都**按声明方法隔离**：

- 键里带上了方法签名，两个方法各自的参数互不串味，同名方案在不同方法下各存各的
- 改 SQL 文本不会丢参数——仍按该方法最近一次保存回落
- 从旧版本升上来的全局预设会在首次命中时自动迁移到方法作用域，不需要手工重存

### 11 种方言分页渲染

| 方言 | 分页语法 |
|------|---------|
| MySQL / MariaDB | `LIMIT [offset,] count` |
| OceanBase（MySQL 模式） | `LIMIT [offset,] count` |
| DM（达梦） | `LIMIT [offset,] count` |
| PostgreSQL / openGauss | `LIMIT count OFFSET offset` |
| KingBase（金仓） | `LIMIT count OFFSET offset` |
| GaussDB / HighGo（瀚高）/ Vastbase（海量） | `LIMIT count OFFSET offset` |
| SQLite / H2 | `LIMIT count OFFSET offset` |
| Oracle | `OFFSET n ROWS FETCH NEXT m ROWS ONLY`（无 offset 时 `FETCH FIRST m ROWS ONLY`） |
| SQL Server | `OFFSET {offset\|0} ROWS FETCH NEXT count ROWS ONLY` |

OceanBase 与 openGauss 的 upsert 冲突子句亦按各自真实形态渲染（openGauss 实为 `ON DUPLICATE KEY UPDATE` MySQL 形态，非 PG 的 `ON CONFLICT`）。

<GifPlayer src="/demo/dialect-pagination.gif" alt="方言分页：设置页数据库方言从 MySQL 切到 Oracle 后，同一处重新预览，分页子句由 LIMIT 5, 5 变为 ORDER BY id DESC OFFSET 5 ROWS FETCH NEXT 5 ROWS ONLY，表名引号也从反引号换成双引号" />

带 `Page` / `IPage` 参数的语句按 MyBatis-Plus `PaginationInnerInterceptor` 的运行时行为模拟分页：预览在原语句后**尾追分页子句**，并**并列产出**一条 COUNT 包裹语句（`SELECT COUNT(*) FROM (原SQL) TOTAL`，带注释说明出处）；`searchCount=false` 与手写 LIMIT 的语句只产其一。COUNT 产物附在面板底部，需要滚到底才看得到。设置页「SQL 预览」子页可关掉整个模拟，或用「附分页 COUNT 查询预览」单独关掉 COUNT 那半。

<GifPlayer src="/demo/pagination-sim.gif" alt="分页拦截器模拟：XML 语句带 IPage 形参时，预览在原 SQL 后尾追 LIMIT 并并列产出带注释的 COUNT 包裹语句 SELECT COUNT(*) FROM (…) TOTAL" />

### JOIN 关系图

联表查询预览附带 JOIN 关系图，走 IDEA 原生 Diagrams 引擎渲染（设置页可切回自绘渲染）。

<GifPlayer src="/demo/join-diagram.gif" alt="JOIN 关系图：MPJ 联表预览切到「JOIN 图」标签页，IDEA 原生 Diagrams 渲染 user / user_address / area 三表节点（列、类型与数据库注释）与 ON 关系连线，可与 SQL 标签页来回对照" />

::: details 节点列口径与渲染行为（何时看：关系图节点列不全或渲染异常时）
JOIN 表与主表同口径绘制实体整表列——超过 50 列的宽表只留主键列，SQL 引用到的列追加在实体列之后；数据源里存在而实体未映射的列也会补进节点，带数据库 COMMENT 与真实类型。列注释来自实体注释与数据库 COMMENT 两路，实体没写注释时取数据库。渲染期间显示加载指示，渲染失败时落错误页并显示原因摘要。
:::

### 安全警示

<GifPlayer src="/demo/danger-warning.gif" alt="把预览 SQL 改成无 WHERE 的 UPDATE 后点「执行 SQL」，确认弹窗升级为无界写警示并逐类列出命中特征" />

UPDATE / DELETE 缺少有效过滤条件时，点「执行 SQL」的确认弹窗升级为无界写警示：标题与按钮形态不变（仍是「确认执行」+ Yes / No，不多加一步），正文改为逐类列出静态检查命中的特征——

- 无 WHERE 条件——语句将作用于全表
- 存在恒真条件（如 `1=1`）——WHERE 不起过滤作用
- OR 分支含恒真条件——任意行都会命中
- LIKE 为纯通配（如 `'%'`）——等价于无过滤
- WHERE 只有常量表达式——没有任何列引用

判据是对 SQL 语法树的静态分析（与回滚视图的快照弱谓词警示同源）；解析失败按最高风险处理，但始终只走这一次确认、不额外拦断。不含上述特征时文案保持原样。

同一个确认弹窗还承担**执行前自检**，把另外两类发现一并列出：

- **方言能力缺口**——语句用到了当前方言不支持的形态：`DELETE ... LIMIT n`（行数上限会被静默丢弃，删除可能影响远多于预期的行）、无原生 UPSERT 形态（预览降级为纯 INSERT，行已存在时会失败）、`SET IDENTITY_INSERT` 包装（本方言不使用该包装，可能是其它方言的遗留产物）
- **未识别列**——预览里对不上数据源真实列的列名，会带上「是否想写 xxx」的建议

两类发现与无界写特征共用同一个弹窗、不新增步骤；都没命中时确认文案逐字不变。

### 静态性能建议

<GifPlayer src="/demo/perf-advice.gif" alt="预览一条单表 LAMBDA_QUERY 时，面板顶部元信息行下方出现静态性能建议分段：红色 ⚠ 的「LIKE '%xxx' 含前导通配符 —— 无法利用 B-Tree 索引，建议改用全文搜索或后缀匹配」；悬停元信息行可看全部建议全文（含 ℹ 前缀的 INFO 级条目，如「ORDER BY 无 LIMIT」）" />

预览出 SQL 的同时，面板顶部元信息行下方按静态规则逐条给出性能建议（如 `ORDER BY` 无 `LIMIT`、`LIKE` 含前导通配符、缺少 `WHERE`、子查询过深等）；红前缀 `⚠` 为警告、蓝前缀 `ℹ` 为提示，与 EXPLAIN 的真实执行计划同屏对照。可见文案按宽度预算截断（末尾补 `…`），**悬停可看全部建议的完整文本**。

### 逻辑删除注入

实体含 `@TableLogic` 时自动追加 `AND deleted = 值`（值可在设置页配置，默认 0）。

<GifPlayer src="/demo/interceptor-injection.gif" alt="逻辑删除注入开关：设置页 SQL 预览子页关掉「逻辑删除实体查询/删除自动追加 AND deleted = 0」后，同一处重新预览，WHERE 末行的 AND deleted = 0 立刻消失、下面的 ORDER BY 上移一行" />

### 执行 SQL

IntelliJ IDEA Ultimate + Database 插件环境下，预览后自动创建临时 .sql 文件，`Ctrl+Enter` 执行。预览弹窗为非模态窗口，执行时如数据源密码过期，IDEA 的密码输入框不会被弹窗遮挡，可直接输入。执行失败时错误直接显示在面板内，不再弹模态框打断操作。

面板状态行会如实说明当前数据源是怎么来的：活控制台绑定显示「已绑定」；只有记忆命中时显示「数据源（上次使用）」或「数据源（本模块上次使用）」——多模块工程里各模块记住各自上次用的源，不会串到别的模块的库；都没有则提示「未绑定数据源（在控制台执行一次查询即可绑定）」。

<GifPlayer src="/demo/execute-sql.gif" alt="执行 SQL 全流程：预览 car_device_info LEFT JOIN station_info 的联表链 → 点「执行 SQL」→ 生成临时文件 mpsql-exec.sql 并提交 mpj_demo@localhost 执行 → 预览窗内 Output / Result 1 页签返回真实数据网格（2 行，如 充电桩A-01），底部原生控制台同屏" />

#### 预览编辑器的 Schema 标注

预览 SQL 里的列名如果与数据源的真实列集合对不上，编辑器会用**红色波浪线**标出来，悬停给出建议列名——不用等执行报错才发现写错了列。标注只作用于预览生成的临时文件（含 `mpsql-exec.sql`），且**宁缺勿错**：冷缓存未就绪、JOIN 多表与 CTE 场景一律不标注，绝不给出可能错的提示。

执行完想改 SQL 再跑一次，点执行视图头部的**「返回预览」**即可回到可编辑的 SQL——不用关窗重开。

面板底部四枚按钮里，**「复制 SQL 并关闭」**是蓝色主行动：一次把当前 SQL 复制到剪贴板并关掉面板，适合「复制出去贴到别处」这条最常见的收尾路径，比先点复制再点取消少一步。

<GifPlayer src="/demo/preview-copy-and-close.gif" alt="复制 SQL 并关闭：预览面板底部点蓝色主行动「复制 SQL 并关闭」→ 面板随即关闭，剪贴板拿到完整 SQL（含 JOIN 与 WHERE）" />

只读类动作（预估影响行数、EXPLAIN、回滚快照查询）走**只读旁路**，不会替换你正在编辑器里看的 SQL——想看结果就开对应的结果视图，想继续编辑就点「返回预览」，两条路互不干扰。

### DML 影响面预演

改完一条 UPDATE / DELETE，想知道它到底会动多少行——预览面板「更多」菜单里的「预估影响行数」把当前 WHERE 谓词改写成等价的只读 `COUNT(*)` 试算语句，经**只读旁路查询**对当前绑定数据源执行：不进共享控制台、不替换你正在看的 SQL。

<GifPlayer src="/demo/dml-impact.gif" alt="DML 影响面预演：预览面板「更多」→「预估影响行数」后，面板顶部出现蓝色加粗横幅「预估影响行数: 1」，悬停可看这次试算用的 COUNT 语句与目标表" />

结果以顶部独立横幅呈现（蓝色加粗），悬停横幅可看这次试算用的语句、目标表与行数上限说明。`DELETE ... LIMIT n` 且方言支持时，横幅显示「≤n（DELETE LIMIT 上限）」，试算语句本身也包一层 `LIMIT` 子查询。

以下形态不做预演，只给一条说明为什么不适用——**宁可不说，也不给一个错的数字**：

| 形态 | 原因 |
|---|---|
| 语句无法解析 | 解析失败即无法保证改写等价 |
| 多语句 | 只支持单条 UPDATE / DELETE |
| 非 UPDATE / DELETE | 其他语句没有「影响行数」这个语义 |
| JOIN / 多表写 | COUNT 会把被 JOIN 匹配多次的行重复计数，数字必然偏大 |
| 无 WHERE | 全表 COUNT 就是全表扫描，正是执行确认里无界写警示拦的形态 |
| WHERE 过于复杂（超长子查询谓词） | 试算语句会极长且成本不可控 |

当前没有绑定数据源时直接弹数据源选择器，选定后自动重试，不用再点一次。试算本身受方言闸门约束：COUNT 按当前方言生成，与目标数据源方言不一致时 fail-closed，不会把另一语法族的 COUNT 送进目标库。

### 方言与数据源不匹配

预览用的方言与要执行的数据源方言对不上时（比如按 Oracle 渲染的 SQL 要提交到 MySQL），插件**只提示、不拦执行**：结果行给出方言不一致的说明，SQL 照样提交到你选定的数据源，由数据库自己判定。

这是有意的设计——方言是渲染与推断层面的事，不该成为执行层面的否决权。用户既然手动选定了数据源，插件就把 SQL 原样送过去；真正对不对，由目标库给出最准确的答案（比如 PostgreSQL 会直接回 `ERROR: relation "user" does not exist`，MySQL 会回语法错）。

唯一仍然拦的情况是**有一边方言未知**（渲染来源不明或目标数据源方言取不到）的写操作与 EXPLAIN：那不是「判断出冲突」，而是「无从判断」，把 PG 语法盲投到 MySQL 库上的风险不可控，此时保持 fail-closed。

结果行同时提供：

- **切换数据源**：换一条方言匹配的源，绑定后按新方言自动重渲染并重试
- **方言设置**：直达插件的方言配置页
- **复制错误信息**：把整段说明复制走，便于贴进 issue 或对话里核对

<GifPlayer src="/demo/dialect-gate.gif" alt="方言不一致时插件已阻止执行：预览按 PostgreSQL 渲染（方言：PostgreSQL 手动指定，SQL 呈 FROM &quot;user&quot; 双引号形态），点「执行 SQL」后结果区出现红色「已阻止执行：当前 SQL 由手动方言 PostgreSQL 渲染，所选数据源是 MySQL」说明行，附「切换数据源」「方言设置」「复制错误信息」三个出口" />

### EXPLAIN 真实执行计划

预览面板按钮行的「执行计划」（英文界面 EXPLAIN）按钮：选中数据源后点击，插件按当前方言把 SQL 包装成 EXPLAIN 语句提交原生数据库控制台执行，真实执行计划与面板顶部的静态性能规则标注同屏对照。EXPLAIN 属免确认类操作，无 DML 二次确认弹窗。

<GifPlayer src="/demo/explain-plan.gif" alt="EXPLAIN 真实执行计划：预览面板点「执行计划」（数据源已绑定 mpj_demo@localhost）→ 插件把 SQL 包装成 EXPLAIN 提交原生数据库控制台执行，下方 Output 页签返回真实计划表（id / select_type / table / partitions / type），与面板顶部「ORDER BY 无 LIMIT」静态性能规则标注同屏对照" />

| 方言 | 渲染形态 | 验证程度 |
|------|----------|----------|
| MySQL / MariaDB | `EXPLAIN <sql>`（原生表格行） | 真机通过 |
| PostgreSQL | `EXPLAIN (FORMAT JSON, VERBOSE) <sql>` | 真机通过 |
| KingBase（金仓） | `EXPLAIN (FORMAT JSON) <sql>` | 真机通过 |
| DM（达梦） | `EXPLAIN <sql>` | 真机通过 |
| H2 | `EXPLAIN PLAN FOR <sql>` | 引擎级单测 |
| SQLite | `EXPLAIN QUERY PLAN <sql>` | 引擎级单测 |
| OceanBase（MySQL 模式） | `EXPLAIN <sql>`（表格行） | 官方文档级验证（真机留账） |
| openGauss | `EXPLAIN (FORMAT JSON) <sql>` | 真机通过 |
| GaussDB | `EXPLAIN (FORMAT JSON) <sql>` | 官方文档级验证（真机留账） |
| HighGo（瀚高） | `EXPLAIN (FORMAT JSON) <sql>` | 社区镜像引擎级实证（V6.0.1，非厂商镜像） |
| Vastbase（海量） | `EXPLAIN (FORMAT JSON) <sql>` | 社区镜像引擎级实证（A 模式） |
| Oracle | `EXPLAIN PLAN FOR <sql>`（计划写入会话级 `PLAN_TABLE`） | 真机通过（Free 23 / XE 11g） |
| SQL Server | `SET STATISTICS XML ON; <sql>; SET STATISTICS XML OFF` | 官方文法落地，真机未验证 |

Oracle 的计划行落在会话级 `PLAN_TABLE` 里、语句本身返回 0 行，面板会给出指引：在同一连接的数据库端另执行 `SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY)` 查看。SQL Server 的计划 XML 是语句执行后的附加结果集，在原生控制台的多结果页签里可见。

「执行计划」与「执行 SQL」一样依赖已配置的数据源（Ultimate 的 Database 工具窗），未配置时会提示先配置。

预览面板顶部元信息行悬停还能看到**方言能力矩阵**——按这条 SQL 的实际渲染方言，列出 `EXPLAIN` / `DELETE ... LIMIT` / `UPSERT` / `IDENTITY 包装` 四项各自是「支持」还是不支持及原因。它是执行前自检与各动作可用性的解释面：某个动作为什么在这条语句上不可用，先看这里。

#### 跨次对比与计划历史（实验特性）

> 本节描述的能力只在开启实验开关后存在；默认形态下执行计划走内嵌原生控制台，没有基线下拉与历史对比。

同一条 SQL 改完索引、加了条件之后，计划到底变没变——只要本会话里已经存过这条 SQL 的历史计划，视图顶部就会出现「选择历史基线对比（不重新执行 SQL）」与一个基线下拉，默认选中「上次执行（当前会话）」，把两次结果做树对齐 diff，标注 cost / rows 的变化；节点的稳定标识是「结构路径 + 同型节点出现序」，兄弟节点增删不会让后面的节点串位。MySQL / MariaDB 的表格族与 PG / KingBase 的 JSON 族可比；Oracle / SQL Server 的文本计划诚实降级为不可比，不硬做 diff。

> 这条能力只在**结构化执行计划视图**里存在，且需要先在设置页「SQL 预览」组开启「预览面板内结构化渲染 EXPLAIN」（实验特性，默认关闭）；默认关闭时执行计划直接走原生数据库控制台，没有基线下拉。

<GifPlayer src="/demo/explain-history-compare.gif" alt="结构化执行计划与基线下拉：同一语句第二次执行计划后，视图顶部出现「选择历史基线对比（不重新执行 SQL）」与「上次执行（当前会话）」下拉" />

默认只在当前会话内比较。要把计划留到下次开 IDE 还能比，需要在设置页「SQL 预览」组单独打开**「跨会话保留原始 EXPLAIN 计划」**——它默认关闭，因为原始计划未经脱敏，谓词里可能带业务值、凭据或密钥。开启后：

- 计划按「项目 + 数据源稳定 UUID + 方言 + 格式 + SQL 指纹」隔离，不会串到别的库或别的语句上
- 每条历史条目最多保留 5 份快照，单份序列化后上限 256 KiB（超限只跳过保存，当前显示的结果不受影响）
- 选历史基线做对比**只读**，不会重新执行 SQL
- 清除预览 SQL 历史会一并删掉已保留的计划；关闭这个开关只停止新增保存，不删已有计划

保存失败时会如实说明原因，不假装存上了：缺稳定数据源 UUID 或同项目历史条目时降级为「仅保留本会话」；计划过大时说明未保存；历史已清空或原条目被删时说明这次迟到结果没有写入。

### 最近执行记录

看着 Wrapper 链源码，想知道它最近一次实际执行长什么样——锚点图标右键选「最近执行记录」，插件从本次会话捕获的日志条目里反查这个位置附近的执行记录（同文件优先、行号 ±30 内排前），并打开一个浏览对话框：

- **左侧列表**直接复用 SQL 日志面板的条目渲染（两行形态、类型色条、耗时与来源角标与日志页一致），支持 **Ctrl / Shift 多选**，状态行显示「已选 N 条」
- **右侧编辑器**展示参数还原后的可执行 SQL，**可直接编辑**——临时改字段值再复制，复制按钮与 Ctrl+C 都取改动后的文本；显示恒为格式化排版（长 SQL 不再挤成一行），编辑器上方两枚图标按钮分别是格式化（幂等重排）与复制
- **多选时**右侧按行序拼接显示全部选中项（所见即复制），Ctrl+C 一次复制多段
- **打开预览**取最后交互的那一行；双击条目同样打开完整预览，且预览后对话框保持在场，便于连续对比多条
- **右键菜单**与 SQL 日志页同源六件：复制时间戳（受「显示时间戳」开关门禁，关闭时置灰）、屏蔽此 SQL、发送到 SQL → Java、发送到日志转 SQL、跳转到 Java、跳转到 Mapper XML（定位不到即隐藏）；**不含删除**——对话框是浏览视图，不改动全局日志缓冲
- 对话框为非模态、可拖拽、尺寸位置记忆；**空命中也弹对话框**，由状态行给出空态文案（不再是一闪而过的通知）

前置条件：日志捕获处于开启状态且已捕获过该位置的执行。详见 [SQL 日志工具窗口](./sql-log)。

### 「更多」菜单里的低频动作

预览面板按钮行只放高频动作，其余收进「更多」。这些动作都作用于**当前面板里这条 SQL**，不改变编辑器里的正文：

| 动作 | 作用 |
|---|---|
| 回滚 SQL | 对当前语句推导逆向 SQL，弹窗先说明这次推导是否可信（详见 [XML 预览 · 回滚 SQL](./xml-preview#回滚-sql)） |
| 导入参数 | 从剪贴板按 JSON / CSV / `key=value` 导入参数值，按列名匹配回填 |
| 差异对比 | 与上一次预览的 SQL 逐行对比 |
| 分享 | 复制为 Markdown / Markdown 表格 / 可执行 SQL，或导出 HTML 报告 |
| 导出可移植 SQL | 把当前 CRUD 语句与回滚语句串联输出，逐条注释标注方言 / 种类 / UPSERT 形态 |
| 导出回放脚本 | 见下 |
| 复制为 AI 上下文 | 见下 |
| 预估影响行数 | 见上文「DML 影响面预演」 |

#### 导出回放脚本

把面板里的 SQL 导出成**单个可直接执行的 `.sql` 文件**——参数已按预览链回填，语句按方言切分并逐条补尾分号，语句里嵌的 `BEGIN ... END` 与引号内分号不会被误切。

<GifPlayer src="/demo/replay-script-export.gif" alt="导出回放脚本：预览面板「更多」→「导出回放脚本」→ 勾选「事务包裹（BEGIN … COMMIT）」→ 保存为 .sql → 打开可见注释头标注方言与条数、语句参数已回填、逐条带尾分号" />

可选「事务包裹（BEGIN … COMMIT）」：勾上后脚本以本方言的显式事务开始语句起头（MySQL `START TRANSACTION`、PG `BEGIN`、SQL Server `BEGIN TRANSACTION`），以 `COMMIT;` 收尾，整批回退把末行改成 `ROLLBACK;` 即可。Oracle / DM 没有可靠的显式事务开始语句，该选项不可用并说明原因，脚本按原样导出。

如果开了「展示与导出脱敏」，导出前会逐语句打码，注释头标 `masked`——此时脚本不再逐字可执行，属预期（你选了脱敏这一交付形态）。

#### 复制为 AI 上下文

把当前 SQL 整理成一段给 AI 用的上下文块进剪贴板。块是**版本化的诊断投影**：带来源与方言、敏感字面量按既有规则识别并参数化（附打码计数）；如果本会话已经取过这条 SQL 的执行计划，还会附上匹配当前 SQL 与实际目标的**已取得计划摘要**，以及真实的静态表列计数。拿不到或已过期的信息**明确标注缺失**，不编造。

<GifPlayer src="/demo/ai-context-copy.gif" alt="复制为 AI 上下文：预览面板「更多」→「复制为 AI 上下文」→ 通知「AI 上下文 v2 已在本地复制（已遮蔽 N 个值、隐藏标识符，缺失项已标注；未请求数据库或网络）」；再演示「含表列名」出口" />

两个出口：默认出口把表名、列名也匿名化；**「复制为 AI 上下文（含表列名）」**保留结构与标识符，便于 AI 理解语义，但字面量照样打码、引号内容不复制。结构词（SELECT / FROM / WHERE / JOIN 等）在任何模式下都原样保留，聚合函数与关键字（COUNT / SUM / JSON / FIRST / NEXT 等）仍按匿名处理。

复制过程**不请求数据库、不调用网络、也不触发 MCP**——计划摘要只取本会话已经拿到的结果，不会为了补全上下文去补跑一次 EXPLAIN。计划摘要只保留白名单节点与数值，不附原计划的条件与 NOTICE。

需要说清边界：**非命中规则的普通字符串仍会保留原文**（比如 `name = 'tom'` 不会被当成敏感值），所以这个块不承诺整段无机密——复制到外部 AI 之前请自己看一遍再删改。它只写剪贴板，不自动上传。

#### 导出诊断报告

分享对话框里的「复制诊断报告（Markdown）」与「导出诊断报告（HTML）」把排查所需的信息聚成一份报告，分五段：

<GifPlayer src="/demo/diagnostic-report.gif" alt="一键诊断报告：预览面板「更多」→「分享」→「复制诊断报告（Markdown）」得到五段式报告；再选「导出诊断报告（HTML）」得到自包含 HTML，浏览器打开可见同样的五段" />

1. SQL 与参数
2. 静态性能规则命中
3. EXPLAIN 建议
4. 无界写发现
5. 回滚预案与方言能力

HTML 版自包含（样式内联），可以直接发给同事或贴进 issue。IDE 侧拿不到真实计划数据时该段诚实标注缺失，不编造。

分享对话框里还有第三项**「审阅诊断报告并反馈」**：它把同一批诊断信息整理成一份**反馈草稿**并打开需求池提交对话框。草稿默认隐藏 SQL 值、注释、参数名与标识符，不附参数、路径、原始计划与附件；遇到不支持的引号形式直接省略 SQL 段，绝不退回原文。正文可逐段删除、可编辑，目的地（公开需求池）与 16 KiB 预算都写明后**逐次同意**才提交——编辑过或提交失败重试，都要重新同意一次。

## 示例

```java
LambdaQueryWrapper<DeviceInfoEntity> wrapper = new LambdaQueryWrapper<DeviceInfoEntity>()
    .eq(DeviceInfoEntity::getId, 1001L)
    .isNotNull(DeviceInfoEntity::getStationId);
```

生成的 SQL：

```sql
SELECT id, station_id, share_scheme_id
FROM device_info_entity
WHERE id = 1001
    AND station_id IS NOT NULL
```

> 对这个功能有建议或遇到问题？[直达需求反馈池](/about/feedback?category=wrapper)
