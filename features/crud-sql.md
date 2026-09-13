# CRUD SQL 生成

在实体类或数据库表上右键，一键生成 SELECT / INSERT / UPDATE / DELETE 语句并进入预览——写 Mapper、排查数据、拼测试数据时不用再手写模板 SQL。

## 触发方式

三个入口，右键菜单选「生成 CRUD SQL」：

- **实体类文件**：编辑器内右键（自动判定 MyBatis-Plus 注解实体）
- **项目视图实体节点**：Project 工具窗中右键实体类文件
- **数据库表节点**：Database 工具窗中右键表节点（需 IntelliJ IDEA Ultimate；Community 版仅实体侧入口可用）

## 候选语句浮层

触发后先弹原生浮层列出候选语句，再进入预览：

- 候选按顺序列出：SELECT（全表）、SELECT（按主键）、INSERT、UPDATE、DELETE；实体含 `@TableLogic` 逻辑删除字段时，实体侧入口额外提供「DELETE（逻辑删除）」变体（生成 `UPDATE 表 SET 逻辑列 = 1 WHERE 主键 = ?`，删除标记值按 MP `logic-delete-value` 默认取 1，`@TableLogic(delval = ...)` 自定义值可在预览里直接改）
- 打字即按摘要过滤，Enter 或双击选定，ESC 关闭；每项双行显示——加粗语句摘要 + 次要色等宽代码行
- 数据库表节点生成以表结构真实列为准；实体侧由实体注解解析出表名与列清单

## 预览与列勾选

选定的语句进入既有 SQL 预览窗口，可直接编辑、格式化、复制：

- INSERT / UPDATE 复用批量参数面板的列勾选：自增主键默认不勾选，对齐 MP 运行时行为
- `@Version` 乐观锁列在 UPDATE 中自动追加到 WHERE，SET 尾写为 `version = version + 1`
- UPDATE / DELETE 按主键定位；表无主键时 WHERE 降级为 `1 = 0` 占位并在候选中提示未识别到主键，避免误生成全表语句
- 实体含逻辑删除字段时的 DELETE 语义差异，由「DELETE（逻辑删除）」变体承载，物理 DELETE 原样保留

> 对 CRUD SQL 生成有建议或遇到问题？[直达需求反馈池](/about/feedback?category=other)
