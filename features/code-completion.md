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

## 数据源字段补全

配置了数据源（IDEA Ultimate 的 Database 工具窗）时，列名补全候选在实体列之外并入数据源真实列——实体列在前，数据源独有的列照常提示；同名列的注释与类型取数据源值，候选项尾部标注数据库真实类型。预热在预览打开与控制台就绪时后台进行，补全时无需等待。

<GifPlayer src="/demo/completion-datasource.gif" alt="在 schema.sql 的 INSERT 语句里、列清单左括号之后敲一个字母，补全弹层最前两条就是数据源里的真实列（share_scheme_id / station_id），各自标注所属表 car_device_info 与数据库类型 INT" />

内嵌控制台执行 DDL 或事务提交（COMMIT / ROLLBACK）后，表 / 列注释缓存自动失效——`ALTER TABLE` 之后立刻预览或补全，不会命中旧结构。

> 对补全功能有建议或遇到问题？[直达需求反馈池](/about/feedback?category=completion)
