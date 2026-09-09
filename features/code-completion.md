# SQL 代码补全
<GifPlayer src="/demo/code-completion.gif" poster="/demo/code-completion.png" alt="SQL 代码补全演示" />

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
| XML 动态标签 | `<if>` / `<where>` / `<foreach>` 等 |
| OGNL 表达式 | `<if test="...">` 内的属性名 |

> 对补全功能有建议或遇到问题？[直达需求反馈池](/about/feedback?category=completion)
