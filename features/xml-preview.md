# XML / HQL 动态 SQL 预览

<GifPlayer src="/demo/xml-preview.gif" alt="XML 动态 SQL 预览演示" />

mapper XML 文件中的动态 SQL 完整预览——按 MyBatis 语义渲染，OGNL 表达式可在面板勾选。同样支持 Hibernate HQL 与 JPA JPQL 预览（见下文）。

## 触发方式

mapper XML 的 `<select>` / `<update>` / `<delete>` / `<insert>` 行左侧 gutter 图标，点击即预览。

自研框架的 mapper XML（根元素名不固定、SQL 写在自定义标签的 CDATA 或文本里，如 RFListPage）同样可预览：叶子标签的首段文本以 SELECT / INSERT / UPDATE / DELETE / WITH / REPLACE 开头即出现 gutter 图标，不依赖标签名与根元素名。

设置页「界面与操作」提供总开关「识别通用 XML 内嵌 SQL（叶子标签文本/CDATA）」，默认开。

::: details 通用 XML 的 HQL 载体（何时看：自定义标签里写的是 HQL 时）
载体标签自身或祖先带 `type="hql"` / `"jpql"` 时走 HQL 转换管道（别名作用域属性列名映射照常生效），实体不可解析或转换失败时回退原文直显；右键与 `Alt+Shift+Q` 入口、多语句选择栏行为与 mapper XML 一致。
:::

## 支持的动态标签

| 标签 | 说明 |
|------|------|
| `<if>` | 条件渲染，test 表达式可在面板勾选 |
| `<choose>` / `<when>` / `<otherwise>` | 分支选择 |
| `<where>` | 智能 WHERE 拼接（去 AND/OR） |
| `<set>` | 智能 SET 拼接（去逗号） |
| `<foreach>` | 集合迭代，值可在面板编辑 |
| `<bind>` | 变量绑定 |
| `<sql>` + `<include>` | SQL 片段复用，跨命名空间全限定 refid 同样支持 |
| `<trim>` | 自定义修剪 |

### 跨命名空间 include

`refid="其它命名空间.片段id"` 的全限定写法可跨文件展开——预览按 namespace 在项目内找到对应 mapper 文件，取出 `<sql id>` 片段内容合并进引用处。

片段内的 `<if>` / `<foreach>` 等动态标签照常渲染，`${}` 动态 refid 也支持，property 静态替换与环检测同样生效。

找不到目标时预览不中断，警示给出具体原因：namespace 无 mapper 文件 / 该 namespace 下无此片段 / 多个文件重复声明同名片段（歧义，差异如实标注）。裸 id 仍只在本文件内查找，与 MyBatis 运行时一致。

## OGNL 表达式面板

<GifPlayer src="/demo/xml-ognl.gif" alt="OGNL 表达式面板：条件行带求值结果「真」，勾掉条件后 WHERE 实时收窄，参数框填值即替换" />

动态条件的 OGNL 表达式（如 `name != null and name != ''`）可在左侧面板勾选，对应 SQL 实时变化。

if 的 test 表达式求值失败时不再静默按 true 展开——会记一条可见错误「已按 true 展开，可用开关覆盖」，预览产物与真实运行时的分叉摆在明面上。

::: details 表达式标注（何时看：条件行出现淡色标注时）
超出受限 OGNL 支持面的 test 表达式，条件行会带一条淡色标注：语法不支持（三元运算、静态方法、`new` 等）标「不支持的表达式形态」，含运行期降级形态标「含运行期降级调用」，悬停可看具体理由。`list.size()`、`isEmpty()` 这类常见写法不会标注；标注只是提示，条件展开行为与勾选开关语义不变。
:::

## 示例

```xml
<select id="selectActive" resultType="User">
    SELECT * FROM user
    <where>
        <if test="name != null and name != ''">
            AND name LIKE #{name}
        </if>
        <if test="status != null">
            AND status = #{status}
        </if>
    </where>
    ORDER BY create_time DESC
</select>
```

渲染结果（勾选 name 条件，status 不勾选）：

```sql
SELECT * FROM user
WHERE name LIKE ?
ORDER BY create_time DESC
```

## ${} 直替提示与执行确认

- 预览含 `${}` 直替时，面板顶部显示一条非模态提示横幅（「预览含 N 处 ${} 直接替换——替换文本未转义，注意 SQL 注入面」），可关闭，关闭后本 IDE 会话不再弹
- 「执行 SQL」与「EXPLAIN」前会弹确认框，说明 raw 段当前以模拟值填充，选否即中止；确认一次后同一面板不再重复弹
- 复制可执行 SQL 不弹窗，产物头部带一行 `-- contains ${} raw segments (mock values)` 注释，让风险随产物走

<GifPlayer src="/demo/xml-exec-guard.gif" alt="含 ${} 直替的语句预览：面板顶部出现「⚠ 预览含 1 处 ${} 直接替换——替换文本未转义，注意 SQL 注入面」横幅（右侧带关闭 ✕），SQL 里 ORDER BY ${orderBy} 以模拟值渲染成 ORDER BY 1；点「执行 SQL」后先弹出确认闸门「SQL 含 ${} 原文拼接段（当前以模拟值填充），执行前请确认值的真实性。继续？Yes / No」，选 No 即中止" />

## 参数面板

参数按签名识别类型类别，输入行给对应占位提示：

| 参数类别 | 占位提示 |
|---------|---------|
| 数字 | `42` |
| 时间 | `2026-01-01 12:00:00` |
| 集合 | `[1, 2, 3]` |
| 对象 | `{"id": 1}` |

集合参数按签名拆分多值：`@Param("taskTypeList") List<String>` 这类直写 `IN (#{taskTypeList})`（无 `<foreach>`）的语句，输入 `PI,WP` 渲染为 `IN ('PI', 'WP')` 而不是整串一个值。

设置页「SQL 预览」组的「空参数填充策略」单选（占位符 `?`（默认）/ NULL 字面量 / 空字符串）决定带签名信息的参数行留空时的填充值。默认保留 `?` 待填提示——NULL 会静默过滤行（如 `amount >= NULL` 恒不匹配），不易察觉有参数没填；需要可直接执行的 SQL 时再切 NULL / 空字符串档。

::: details 类型识别边界（何时看：警示提示或 mock 值不符预期时）
- 数字或时间输入不合法时行尾给淡色警示，提示不是闸门，值仍原样进 SQL。
- mock 占位值按类别分派：`BigInteger` 归数值档、`UUID` 归文本档；含识别不了类型的参数时执行 / EXPLAIN 前提示一次（预览不阻断）。
- 引号按元素类别决定（`List<String>` 带引号、`List<Long>` 裸渲染），`IN` 与 `(` 之间的换行、多空格也能正确识别为 IN 形态。
:::

## 执行防护

- **无界写发现清单**：UPDATE / DELETE 的执行确认在静态检查命中无界写特征时列出发现——无 WHERE 全表、恒真条件（`1=1` 等）、`LIKE '%'` 纯通配等；无发现时确认文案保持不变
- **执行超时**：设置项「执行超时」（秒，默认 30，0 = 不限），超时先请求取消再报错，挂死查询不再停在加载态
- **报错定位**：执行报错富化 SQLState / 驱动错误码与出错位置，「定位到出错语句」按钮一键跳到预览源中该语句起始行
- **断连 DDL 探测**：连接断开时执行 CREATE 类 DDL，后台探测对象是否已存在并如实警示（「已存在」/「未检出」），不把「没查到」包装成「没生效」
- **多语句确认**：日志转 SQL 产物一键执行，单条直通、多条弹候选勾选浮层
- **`\G` 后缀剥离**：MySQL 命令行的 `\G` 后缀（如 `SELECT 1\G`）粘进预览或控制台执行前自动剥离；非 MySQL 数据源不剥离
- **会话与数据源**：同名多条数据源不再静默取第一条，最近使用记忆按 UUID 精确命中（数据源改名也认）；共享控制台复用前先做身份探测

::: details 多语句与界符细节（何时看：存储过程脚本或多语句切分异常时）
`DELIMITER $$` 等自定义界符的存储过程脚本按界符整段收集，不再被顶层 `;` 误切；语句里 IME 误输的全角括号（`（`/`）`）与半角括号同栈计数，混对语句不再被误切成多条或吞并后续语句。`\G` 后缀剥离在注释与字符串内不碰，历史保留原文。
:::

预览执行、日志转 SQL 执行与回滚执行共用同一套确认与防护链路。

## 回滚 SQL

<GifPlayer src="/demo/xml-preview-rollback.gif" alt="XML 预览回滚 SQL 演示" />

预览面板「更多」菜单里的「回滚 SQL」（菜单首项）对当前预览的语句推导逆向 SQL，弹窗先说明这次推导是否可信，再给出可复制的产物。

### INSERT：自动生成回滚

INSERT 是唯一能自动生成回滚的语句：按 VALUES 逐行生成 `DELETE FROM 表 WHERE …`，谓词是该行每一列的等值（`NULL` 渲染为 `IS NULL`）。

插件不查数据库元数据，拿不到主键，谓词只能按整行——可能误匹配多行。弹窗为此给出警示，并附一条 `SELECT COUNT(*) FROM 表 WHERE …` 自查语句供执行前核对；语句含未回填的 `?` 占位符时另行标注。

无列清单的 INSERT（列名未知）、INSERT … SELECT（执行前数据未知）与 upsert（可能改过已存在的行，DELETE 回不干净）一律拒绝。

### UPDATE / DELETE：粘贴查询结果生成

UPDATE 与 DELETE 不给自动回滚——插件只有 SQL 文本，没有执行前的原值（before-image），逆推出来的语句会连带覆盖别人的后续修改。

弹窗如实说明原因（「UPDATE 无法自动回滚：原值不可考。」/「DELETE 无法自动回滚：被删数据不可考。」），给出 binlog、闪回或备份还原的人工恢复指引，并附一条快照查询 `SELECT * FROM 表 [WHERE 原 WHERE]`：

1. 点「执行快照查询」直达，结果落在面板控制台网格——由你亲手取回行镜像
2. 把结果网格整块复制粘回弹窗（TSV，首行为列名）
3. 点「按粘贴结果生成回滚」：原语句是 DELETE 时拼 INSERT 全列回填，原语句是 UPDATE 时生成反向 UPDATE，并把写入后的新值一并写进 WHERE 做乐观锁校验——只有库内仍是写入后的状态才回滚得动

主键列可在输入框按逗号分隔填写，对 UPDATE 生效：填了按主键定位，不填按整行旧值镜像。粘贴行数或语句体量超上限会截断并提示；生成出内容之前「执行回滚」与「复制」是禁用态。

### 其余语句与多语句判定

SELECT、MERGE、DDL 等其余语句不打开弹窗，只给一条说明为什么不支持的消息框。多语句预览整体判定：只要有一条不可推导就不输出部分回滚——半截回滚比不回滚更危险。

## SQL 快捷模板

mapper XML 与预览编辑器里选中文本后，右键菜单「SQL 快捷模板」可一键 EXPLAIN / COUNT / 抽样 10 行，走原生 Database 控制台链路执行。这三个动作默认不占键位，如需快捷键可在 设置 > Keymap 或插件设置页「快捷键」节录制。

## 渲染标注与降级提示

- 竖排模式下 UPDATE 的 SET 各项行尾追加「列名 (new) = 表达式」标注（自引用写法如 `a = a + 1` 原样即新值），新旧值对照更直观
- 多列动态 INSERT 的预览在每个 VALUES 表达式 / SELECT 投影旁以 inlay 提示标出目标列名，列-值错位一眼可见（投影已带同名列别名、或静态不可判时不重复提示）
- 预览面板与日志转 SQL 面板内嵌非模态降级提示，说明哪段没还原、为什么、能做什么，不再静默截断

## HQL / JPQL 预览

插件对 Hibernate HQL 与 JPA JPQL 同样提供静态预览，入口均在 Java 源码行左侧 gutter 图标：

| 入口 | 位置 |
|------|------|
| `session.createQuery(hql)` 等 Hibernate HQL 调用 | HQL 字符串所在行 |
| `@Query("...")` 注解（JPQL，含 `@Modifying` DML） | 注解行 |
| JPA Repository 派生方法与 CRUD 方法 | 方法声明 / 调用行 |

HQL 字符串被 `+` 拆分到多行、或经链式赋值拼接时同样可识别，gutter 图标正常出现。

其余入口（`@NamedQuery` 命名查询、JPA CriteriaQuery 调用链、自定义 DAO 的 HQL 查询方法、`.hbm.xml` 映射实体）同样触发预览。

完整触发面与能力说明（Repository CRUD 写路径、派生查询、Specification、QueryByExample、分页排序等）见 [JPA / Hibernate SQL 预览](./jpa-preview)。

### SELECT 实体别名自动展开

HQL 语义中 `SELECT u` 表示取整个实体 `u`，但照原样输出到 SQL 会在 MySQL 报 `[1054] Unknown column 'u' in 'field list'`。插件会自动把裸实体别名展开为该实体的列清单：

```sql
-- HQL: SELECT u FROM User u WHERE u.status = 1
-- 展开后：
SELECT u.id, u.name, u.status, ... FROM user u WHERE u.status = 1
```

展开规则：

- 裸别名且登记在 FROM / JOIN 中才展开，DELETE / DISTINCT / 子查询 / 聚合 / 显式列清单不受影响
- 没有 SELECT 子句时自动补列清单
- JOIN 副表或实体元数据缺失时降级为 `alias.*`

> 对这个功能有建议或遇到问题？[直达需求反馈池](/about/feedback?category=xml)
