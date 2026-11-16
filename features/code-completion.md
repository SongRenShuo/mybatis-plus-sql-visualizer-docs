---
title: "MyBatis XML / 注解 SQL 代码补全（表名、列名、#{} 参数）"
description: "mapper XML 与 Java SQL 注解字符串里的 SQL 补全——Ctrl+Space 补表名、列名、#{} 参数名与动态标签，配数据源后并入数据库真实列。"
---

# SQL 代码补全
<GifPlayer src="/demo/code-completion.gif" alt="SQL 代码补全演示" />

mapper XML 与 Java SQL 注解字符串内 `Ctrl+Space` 补全。

## 触发位置

- mapper XML 文件中的 SQL 字符串
- Java Mapper 接口中 `@Select` / `@Update` 等注解字符串
- 预览弹窗的输入框

## 补全内容

| 类型 | 说明 |
|------|------|
| 表名 | 根据项目实体类推断 |
| 列名 | 按子句位置提示：FROM / JOIN 后提示表名，其余位置提示列名；`别名.` 前缀按对应实体提示列，注释参与检索 |
| `#{}` 参数名 | 方法参数名（`@Param` 值优先，含 param1..N 兜底） |
| XML 动态标签 | `<if>` / `<where>` / `<foreach>` 等；`<foreach>` 的 `collection` 属性在方法只有一个集合参数又没写 `@Param` 时，候选列出 `collection` / `list` / `array` 快捷名（与 MyBatis 参数命名语义一致） |
| OGNL 表达式 | `<if test="...">` 内的属性名 |

## 列名候选与大小写

实体列名是驼峰（`delFlag`）、SQL 里写大写蛇形时，敲 `DEL_F` 同样能补出 `DEL_FLAG`——列名候选同时收录原名 / snake / UPPER_SNAKE 三种形态，任一形态命中即给出。

插入形态跟随你正在输入的大小写风格：大写 SQL 就提大写，小写 SQL 就提小写，混合或空前缀按实体原形态；其余别名注册为可查找串，敲哪种形态都能搜到。

MBG 生成的查询按惯例识别：`selectByExample(XxxExample)` 的实参是查询条件对象，不会被当成实体推出 `xxx_example` 假列——按 MBG 约定回查同包实体 `Xxx` 取列，查不到则跳过（宁可不给也不给假列）。mapper 接口与泛型都解析不到时，兜底从语句文本的 FROM / JOIN 表名反查实体再取列，只在前两条主实体链路都失败时生效。

打开 mapper XML 时，插件即在后台把表 / 列上下文备好，首次敲补全不从零解析；跨文件片段名与 mybatis-config 变量清单项目级建一次、按索引状态更新，大工程里连续补全不再逐文件重扫。

## 数据源字段补全

配置了数据源（IDEA Ultimate 的 Database 工具窗）时，列名补全候选在实体列之外并入数据源真实列——实体列在前，数据源独有的列照常提示；同名列的注释与类型取数据源值，候选项尾部标注数据库真实类型。预热在预览打开与控制台就绪时后台进行，补全时无需等待。

<GifPlayer src="/demo/completion-datasource.gif" alt="在 schema.sql 的 INSERT 语句里、列清单左括号之后敲一个字母，补全弹层最前两条就是数据源里的真实列（share_scheme_id / station_id），各自标注所属表 car_device_info 与数据库类型 INT" />

内嵌控制台执行 DDL 或事务提交（COMMIT / ROLLBACK）后，表 / 列注释缓存自动失效——`ALTER TABLE` 之后立刻预览或补全，不会命中旧结构。

> 对补全功能有建议或遇到问题？[直达需求反馈池](/about/feedback?category=completion)
