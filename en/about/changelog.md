# Changelog

Data source: [JetBrains Marketplace](https://plugins.jetbrains.com/plugin/33633-mybatis-plus-sql-visualizer)

## 2026.8.21 (2026.8.22)

## v2026.8.21

    - JPA/Hibernate SQL 预览支持（Derived / CriteriaQuery / HQL 三种查询风格）
    - Hibernate/JPA SQL 日志捕获支持（双解析器并列架构）
    - SQL→Java 反向子查询 JOIN 解析 + MConsumer 形态
    - JPA 分页修复（Pageable → LIMIT）+ @Query 路由优先
    - JPQL IN 子句三层修复 + 复制时剥离注释

## v2026.8.20

    - 参数导入交互体验升级（手动输入弹窗 + 驼峰/下划线自动匹配 + 清除按钮）
    - 内存泄漏修复（面板 Disposer 树注册）
    - SQL 监听手动启动无需等待项目运行（armed 态）+ 解析兼容前缀与 SQL 分行形态
    - 插件自更新静默失败修复（改用 PathManager 定位插件目录 + zip 顶层短名）
    - SQL→Java 调用类校验（VO/DTO 拒绝 + 白名单放行）+ 当前打开类智能识别（this/baseMapper 上下文感知）
    - MPJ 工厂链 selectAll 双图标修复（initializerHeadIsWrapper 回溯停在 qualifier 引用）
    - IN 子句参数多值回填（XML/MP/MPJ inList 标记 + 逗号分割渲染）+ 关键字换行格式化
    - ReadAction.compute 废弃 API 修复（T-M52 补充，@Suppress DEPRECATION）+ 测试覆盖缺口体系化修复（T0045，四类缺口 4 波修复）

## v2026.8.19

    - 废弃API全量清理（T-M51 + T-M52）+ 插件更新机制修复（2026.8.19，ProtectionDomain.codeSource.location 定位 + DeleteCommand）
    - IService 内置 CRUD 方法预览支持无 Entity 后缀实体类
    - 功能截图替换 + Marketplace Custom Page

## v2026.8.18

    - 监听启动时机修正（打开项目不监听，启动运行才监听；停止运行自动停止）
    - 关闭工具窗口时停止监听设置生效（监听 ToolWindow 可见性变化）
    - SQL 日志列表改为正序（最早在前）+ 工具栏捕捉按钮状态实时刷新
    - 项目停止后监听不关闭修复（进程存活检查 + 移除 processTerminated 误触发）
    - 第一条 SQL 丢失修复 + 手动停止后重启不再自动开启
    - SQL→Java 联表反向转换修复（反引号列/换行转义/三参联表/selectAs/副表列归属）
    - invocationHasMpj 接口继承 + 泛型超类型误判修复
    - selectAs 字符串联接 + VO-only + VO 属性方法引用修复（T-M48~M50）
    - 实体选择弹窗唯一推断时跳过（T-M49）+ notificationGroup schema 报错修复
    - 插件描述与最新变化优化 + README 去 AI 味重写

## v2026.8.17

    - SQL→Java 生成代码三改进（T-M45：复制纯代码/格式化代码按钮/行尾注释）
    - 调用方法按调用类真实 API 选择（T-M44）
    - UPSERT 按方言渲染与反向分页宽容（T-M43）
    - 日志五项修复（T-M42：弹窗自动识别参数/Ctrl+C 复制/EDT 报错/this·baseMapper/serialVersionUID 忽略）
    - 三处图标统一优化 + 功能截图 5 张入库（T-M40）
    - SQL→Java 右键预览高亮 + 快捷键可配置（T-M41）
    - SQL→Java 调用形态按 MPJ 1.5.6 实证重写 + 性能修复
    - 手动选择实体类 + AUTO 形态 @TableName 反查 + ? 占位符反向识别

## v2026.8.16

    - SQL 日志工具窗口 + SQL→Java 双向转换（正向渲染/反向解析）
    - 反向联表修复（反引号列/换行转义/三参联表/selectAs/副表列归属）
    - invocationHasMpj 接口继承 + 泛型超类型误判修复
    - 实体选择弹窗唯一推断时跳过 + notificationGroup schema 报错修复

## v2026.8.15

    - XML + 注解动态 SQL 预览引擎（M24/M25/M26）
    - 更新链路全面兼容（检查更新/自动安装）
    - SQL→Java 反向 ? 占位符识别缺陷修复

## v2026.8.14

    - 官方 API 全覆盖 + 批量参数增强
    - SQL→Java 反向转换增强 + 方言全兼容

## v2026.8.13

    - 首发版本：MP SQL 预览弹窗 + Gutter 图标 + 工具窗口
    - 基础正向渲染 + 历史参数召回

## 2026.8.20 (2026.8.21)

## v2026.8.20

    - 参数导入交互体验升级（手动输入弹窗 + 驼峰/下划线自动匹配 + 清除按钮）
    - 内存泄漏修复（面板 Disposer 树注册）
    - SQL 监听手动启动无需等待项目运行（armed 态）+ 解析兼容前缀与 SQL 分行形态
    - 插件自更新静默失败修复（改用 PathManager 定位插件目录 + zip 顶层短名）
    - SQL→Java 调用类校验（VO/DTO 拒绝 + 白名单放行）+ 当前打开类智能识别（this/baseMapper 上下文感知）
    - MPJ 工厂链 selectAll 双图标修复（initializerHeadIsWrapper 回溯停在 qualifier 引用）
    - IN 子句参数多值回填（XML/MP/MPJ inList 标记 + 逗号分割渲染）+ 关键字换行格式化
    - ReadAction.compute 废弃 API 修复（T-M52 补充，@Suppress DEPRECATION）+ 测试覆盖缺口体系化修复（T0045，四类缺口 4 波修复）

## v2026.8.19

    - 废弃API全量清理（T-M51 + T-M52）+ 插件更新机制修复（2026.8.19，ProtectionDomain.codeSource.location 定位 + DeleteCommand）
    - IService 内置 CRUD 方法预览支持无 Entity 后缀实体类
    - 功能截图替换 + Marketplace Custom Page

## v2026.8.18

    - 监听启动时机修正（打开项目不监听，启动运行才监听；停止运行自动停止）
    - 关闭工具窗口时停止监听设置生效（监听 ToolWindow 可见性变化）
    - SQL 日志列表改为正序（最早在前）+ 工具栏捕捉按钮状态实时刷新
    - 项目停止后监听不关闭修复（进程存活检查 + 移除 processTerminated 误触发）
    - 第一条 SQL 丢失修复 + 手动停止后重启不再自动开启
    - SQL→Java 联表反向转换修复（反引号列/换行转义/三参联表/selectAs/副表列归属）
    - invocationHasMpj 接口继承 + 泛型超类型误判修复
    - selectAs 字符串联接 + VO-only + VO 属性方法引用修复（T-M48~M50）
    - 实体选择弹窗唯一推断时跳过（T-M49）+ notificationGroup schema 报错修复
    - 插件描述与最新变化优化 + README 去 AI 味重写

## v2026.8.17

    - SQL→Java 生成代码三改进（T-M45：复制纯代码/格式化代码按钮/行尾注释）
    - 调用方法按调用类真实 API 选择（T-M44）
    - UPSERT 按方言渲染与反向分页宽容（T-M43）
    - 日志五项修复（T-M42：弹窗自动识别参数/Ctrl+C 复制/EDT 报错/this·baseMapper/serialVersionUID 忽略）
    - 三处图标统一优化 + 功能截图 5 张入库（T-M40）
    - SQL→Java 右键预览高亮 + 快捷键可配置（T-M41）
    - SQL→Java 调用形态按 MPJ 1.5.6 实证重写 + 性能修复
    - 手动选择实体类 + AUTO 形态 @TableName 反查 + ? 占位符反向识别

## v2026.8.16

    - SQL 日志工具窗口 + SQL→Java 双向转换（正向渲染/反向解析）
    - 反向联表修复（反引号列/换行转义/三参联表/selectAs/副表列归属）
    - invocationHasMpj 接口继承 + 泛型超类型误判修复
    - 实体选择弹窗唯一推断时跳过 + notificationGroup schema 报错修复

## v2026.8.15

    - XML + 注解动态 SQL 预览引擎（M24/M25/M26）
    - 更新链路全面兼容（检查更新/自动安装）
    - SQL→Java 反向 ? 占位符识别缺陷修复

## v2026.8.14

    - 官方 API 全覆盖 + 批量参数增强
    - SQL→Java 反向转换增强 + 方言全兼容

## v2026.8.13

    - 首发版本：MP SQL 预览弹窗 + Gutter 图标 + 工具窗口
    - 基础正向渲染 + 历史参数召回

## 2026.8.19 (2026.8.19)

## v2026.8.19

    - 废弃API全量清理（T-M51 + T-M52）：三版本 0 Internal + 0 Scheduled-removal + Deprecated 9/11/27→3/4/20
    - IService 内置 CRUD 方法预览支持无 Entity 后缀实体类
    - PluginManager.getPlugin() 完全消除（ProtectionDomain.codeSource.location + DeleteCommand 替代）
    - ProjectListenerRegistrar 删除（projectOpened() 无公开替代）
    - ToolWindowFactory Kotlin→Java 改写消除 synthetic bridge
    - 功能截图 5 张替换真实截图 + Marketplace Custom Page + plugin.xml 清理内嵌图

## v2026.8.18

    - 监听启动时机修正（打开项目不监听，启动运行才监听；停止运行自动停止）
    - 关闭工具窗口时停止监听设置生效（监听 ToolWindow 可见性变化）
    - SQL 日志列表改为正序（最早在前）+ 工具栏捕捉按钮状态实时刷新
    - 项目停止后监听不关闭修复（进程存活检查 + 移除 processTerminated 误触发）
    - 第一条 SQL 丢失修复 + 手动停止后重启不再自动开启
    - SQL→Java 联表反向转换修复（反引号列/换行转义/三参联表/selectAs/副表列归属）
    - invocationHasMpj 接口继承 + 泛型超类型误判修复
    - selectAs 字符串联接 + VO-only + VO 属性方法引用修复（T-M48~M50）
    - 实体选择弹窗唯一推断时跳过（T-M49）+ notificationGroup schema 报错修复
    - 插件描述与最新变化优化 + README 去 AI 味重写

## v2026.8.17

    - SQL→Java 生成代码三改进（T-M45：复制纯代码/格式化代码按钮/行尾注释）
    - 调用方法按调用类真实 API 选择（T-M44）
    - UPSERT 按方言渲染与反向分页宽容（T-M43）
    - 日志五项修复（T-M42：弹窗自动识别参数/Ctrl+C 复制/EDT 报错/this·baseMapper/serialVersionUID 忽略）
    - 三处图标统一优化 + 功能截图 5 张入库（T-M40）
    - SQL→Java 右键预览高亮 + 快捷键可配置（T-M41）
    - SQL→Java 调用形态按 MPJ 1.5.6 实证重写 + 性能修复
    - 手动选择实体类 + AUTO 形态 @TableName 反查 + ? 占位符反向识别

---

[View more →](https://gitee.com/songrenshuo/mybatis-plus-sql-visualizer/releases)
