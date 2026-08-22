# SQL 代码补全

mapper XML 与 Java SQL 注解字符串内 `Ctrl+Space` 补全。

## 触发位置

- mapper XML 文件中的 SQL 字符串
- Java Mapper 接口中 `@Select` / `@Update` 等注解字符串
- 预览弹窗的输入框

## 补全内容

| 类型 | 说明 |
|------|------|
| 表名 | 根据项目实体类推断 |
| 列名 | 按子句位置智能提示（SELECT 提示列名，WHERE 提示条件列） |
| `#{}` 参数名 | Java 实体属性名 |
| XML 动态标签 | `<if>` / `<where>` / `<foreach>` 等 |
| OGNL 表达式 | `<if test="...">` 内的属性名 |

<GifPlayer src="/demo/code-completion.gif" alt="SQL 代码补全演示" />
