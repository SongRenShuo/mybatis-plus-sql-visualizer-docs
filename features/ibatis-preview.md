---
title: "iBatis 2.x SQL 预览与跳转"
description: "iBatis 2.x（sqlMap）老工程的 SQL 预览：#name# 占位、14 种动态条件标签按官方引擎语义渲染，参数可勾选可填值，sqlMap 语句与 Java DAO 调用双向跳转。"
---

# iBatis 2.x SQL 预览与跳转

iBatis 2.x 的 `<sqlMap>` 文件与 MyBatis mapper 同待遇：语句预览、SQL 注入着色、关键字补全、双向跳转、参数交互全部接上，走独立的 iBatis 2 渲染链，不再依赖「通用 XML 内嵌 SQL」的兜底通道。

渲染口径以 iBatis 官方 2.3.4.726 引擎做黄金对照——不连数据库直取引擎真值，20 种典型形态逐字节一致，包括「`prepend` 逐字拼接不补空格」这类反直觉行为（真实输出会出现 `ANDORG_NAME` 这种粘连，预览原样复现、不做美化）。

<GifPlayer src="/demo/ib1_ibatis_preview.gif" alt="iBatis 2.x 语句预览：点 User.xml 的 selectByCondition 语句行 gutter 图标弹出预览，动态条件逐框勾选（ID = 1 / STATUS = 1 / AGE > 19 逐段进 WHERE），username 条件填值 tom 后 SQL 实时出现 USER_NAME LIKE '%tom%'——勾选与填值都按 iBatis 引擎语义即时渲染，不满足条件的段由引擎裁掉" />

## 触发方式

`<sqlMap>` 文件里的语句行（`<select>` / `<insert>` / `<update>` / `<delete>` / `<statement>` / `<procedure>`）左侧 gutter 图标，点击即预览。

文件识别按「根元素是 `<sqlMap>` / DOCTYPE 命中 iBatis 标识 / classpath 上有 `com.ibatis.sqlmap.client.SqlMapClient`」三选二判定——iBatis 与 MyBatis 3 的标签名高度重叠（`<select>` / `<insert>` 两边都有），MyBatis 3 的 `<mapper>` 文件不会被误判成 iBatis。

## 占位符与动态标签

### 占位符四态

| 形态 | 含义 |
|------|------|
| `#name#` | 普通参数占位 |
| `#name:jdbcType#` | 带 JDBC 类型 |
| `#name:jdbcType:nullValue#` | 带 JDBC 类型与空值替换 |
| `#name,jdbcType=?` | 逗号写法的类型标注 |
| `$name$` | 字符串直替（与 MyBatis 的 `${}` 同风险，走既有注入确认闸门） |

`##` / `$$` 判为字面量而非参数（转义），不参与预览替换。

### 动态标签

- **条件标签 14 个**：`isEqual` / `isNotEqual` / `isGreaterThan` / `isGreaterEqual` / `isLessThan` / `isLessEqual` / `isNull` / `isNotNull` / `isEmpty` / `isNotEmpty` / `isPropertyAvailable` / `isNotPropertyAvailable` / `isParameterPresent` / `isNotParameterPresent`
- `<dynamic>` 的 `prepend` 属性按官方语义消费
- `<iterate>` 支持 `open` / `conjunction` / `close` 属性与 `#ids[]#` 下标展开
- `<sql>` / `<include>` 片段配置期内联（引擎要求片段声明在引用之前，本插件先收全表再展开、支持前向引用但不告警）
- `<selectKey type="pre|post">` 参与渲染

## 参数面板：条件可勾选、值可填

此前 iBatis 预览固定按无参基线渲染——`<dynamic>` 条件全部不成立、参数面板为空。现在按语句生成参数行与条件行，SQL 随填值变化：

- **动态条件按行勾选**：14 种 `<isXxx>` 条件逐行列出，勾选即展开进 WHERE，取消即收起，与 MyBatis 的 OGNL 面板同款交互
- **值可填**：参数行输入值后占位即时替换；`<iterate>` 给填值列表（逗号分隔，按长度展开 `ids[0..n-1]`）
- **数值比较**：`compareValue="18"` 与值 `"9"` 按数值比较判定，不再走字典序误判 `"9" > "18"` 成立

声明了 `<parameterMap>` 且语句体内手写 `?` 的语句，参数名按位置对齐到 `<parameter>` 声明——面板显示真实属性名（如 `username` / `email`），不再一律 `param1..N`；未消费的声明单独提示。没有 `<parameterMap>` 时仍显示 `param1..N` 并注明「参数名不可知」。

::: details 降级提示的分档（何时看：预览出现横幅时）
某段无法渲染时，横幅明确标注哪个标签、什么原因（如 `<iterate property='ids'>` 需要集合取值），不再静默产出半截 SQL 配一句与事实不符的说明。横幅分两档：信息性说明（ℹ）与失败警示（⚠ 预览未完整还原），各自如实。横幅跟随重渲染结果——填值展开后自动消失，清空后以信息级回归。
:::

## 编辑器注入

- **语法着色**：语句文本按 SQL 语法着色，`#name#` / `#name:jdbcType#` / `#name:jdbcType:nullValue#` / `$name$` 四态按配对闭合识别分色加底色——未闭合的占位不会吞掉后续文本；`##` / `$$` 按字面量着色
- **输入补全**：输入 `#` / `$` 自动补出成对闭合；占位符与关键字补全可用
- **动态标签折叠**：按语句结构折叠展开
- **属性值刻意不注入**：`property` / `compareValue` / `refid` 等 iBatis 属性与 MyBatis 属性名高度重叠，强行注入会改变 `<mapper>` 文件的既有行为——这是刻意的边界，不是遗漏

`<sqlMap>` 引用的两份 DTD（`sql-map-2.dtd` / `sql-map-config-2.dtd`）随插件内置：iBatis 引擎配置期从 classpath 读 DTD 不联网，但 IDE 会按 DOCTYPE 外链去取，而 `www.ibatis.com` 域名早已失效——8 条 DOCTYPE 标识全部映射到随包副本，老工程打开不再转圈等超时。

## 双向跳转

### XML 内部 id 引用

`<include refid>` → 同文件 `<sql id>`；`resultMap=` / `parameterMap=` / `<resultMap extends>` → 同名定义。全部是软引用：目标不存在时零报红，不注册任何校验器形态。

### Java DAO → XML 语句

`SqlMapExecutor` 入口方法（`queryForObject` / `queryForList` / `queryForMap` / `queryWithRowHandler` / `queryForPaginatedList` / `insert` / `update` / `delete`）的首个字符串实参，跳到对应语句的 `id` 属性。

### 双向箭头

与 MyBatis mapper 文件同款的跳转箭头：语句行箭头落到 Java DAO 的调用实参，调用行箭头落到 XML 语句的 `id` 属性；不依赖箭头时 Ctrl+B / Ctrl+Click 同样可跳。

<GifPlayer src="/demo/ib2_ibatis_nav.gif" alt="双向跳转：点 User.xml 的 selectById 语句行跳转箭头，编辑器落到 UserDaoImpl 的 queryForObject(&quot;User.selectById&quot;, id) 调用行；再点调用行箭头，跳回 XML 语句行" />

::: details 与同类导航插件共存（何时看：装了 MyBatisCodeHelperPro 时）
iBatis 的跳转箭头**不受**「与同类 MyBatis 导航插件共存时让位」开关影响——竞品没有 iBatis 能力、不会在同一行画自己的箭头，不存在图标冲突，双方同装时本插件的 iBatis 箭头照常显示。该让位开关只作用于 MyBatis mapper 文件的跳转图标（见 [XML / HQL 动态 SQL 预览](./xml-preview)）。
:::

::: details 识别口径与边界（何时看：跳转没反应或跳错时）
- 跳转是**语法级识别**：方法名 + 首参是字符串字面量，不做接收者类型解析。工程里若另有非 iBatis 的同名方法、且项目内恰有同名 sqlMap 语句，可能出现一次跳转；无目标时不产生任何效果。
- 跨文件 id 清单（解析 `sqlMapConfig` 的 `<sqlMap resource>`）与 XML → Java 反查不在本期；跨文件 `<include>` 仅支持同文件与 namespace 回退。
- Kotlin DAO 调用形态与 `<selectKey>` 隐式 id（`<insertId>-SelectKey`）暂不支持。
:::

## SQL 日志列表

增强捕获与控制台捕获的条目里，iBatis 语句拆出独立的 `IBATIS` 来源角标，按来源展示 / 筛选可区分。控制台通道识别 iBatis 的 `{pstm-N}` 三行组日志（`Executing Statement` + `Parameters` + `Types`），参数列表剥掉结构方括号、类型按位置并入，还原成可执行 SQL（见 [MyBatis 日志转完整 SQL](./sql-log)）。

## 已知边界

- iBatis 批处理一期不支持；参数行元素内含逗号或嵌套方括号时按逗号切分（`List.toString` 不可逆）
- 属性值不注入着色（刻意，见上文「编辑器注入」）
- 其余跳转与跨文件边界见上文折叠块

> 对这个功能有建议或遇到问题？[直达需求反馈池](/about/feedback?category=xml)
