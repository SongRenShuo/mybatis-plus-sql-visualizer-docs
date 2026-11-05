# 快速开始

3 分钟上手 SQL Visualizer。

## 我想做什么

按目标直达，每条最多三步见效：

1. **预览 Wrapper 链** — 装好插件（见下文「安装插件」），光标落在 Wrapper 链的变量声明行，点左侧 gutter 图标或按 <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>Q</kbd>，弹窗即出 SQL。本页下方就是完整走法，深入用法见 [Wrapper → SQL 预览](../features/wrapper-preview.md)
2. **预览 XML 动态 SQL** — 打开 mapper XML，点 `<select>` 等 SQL 标签行左侧的 gutter 图标。详见 [XML / HQL 动态 SQL 预览](../features/xml-preview.md)
3. **预览 JPA / HQL** — 打开 Repository 方法、`@Query` 注解或 HQL 字符串所在行，点 gutter 图标。详见 [JPA / Hibernate SQL 预览](../features/jpa-preview.md)
4. **看运行期 SQL 日志** — 项目启动后打开「SQL 日志」工具窗口，运行中的 SQL 带着真实参数入列。详见 [SQL 日志工具窗口](../features/sql-log.md)

## 安装插件

<Steps :title="''">

### 方式一：IDE 内置插件系统安装（推荐）

1. 打开 <kbd>Settings/Preferences</kbd> > <kbd>Plugins</kbd> > <kbd>Marketplace</kbd>
2. 搜索 `SQL Visualizer`
3. 点击 <kbd>Install</kbd> 安装
4. 首次安装后若未看到插件入口，重启一次 IDEA；后续版本更新通常免重启热生效（离线更新通道亦支持热替换）

![Marketplace 里搜索 SQL Visualizer：结果首条即本插件（作者 SongRenShuo），右侧详情页带「安装」按钮与版本号](/demo/install-marketplace.webp)

### 方式二：手动下载插件安装

1. 在 [JetBrains Marketplace](https://plugins.jetbrains.com/plugin/33633-sql-visualizer) 或 [Gitee Releases](https://gitee.com/songrenshuo/mybatis-plus-sql-visualizer/releases) 下载插件包
2. 进入 IDE，打开 <kbd>Settings</kbd> > <kbd>Plugins</kbd> > <kbd>⚙</kbd> > <kbd>Install Plugin from Disk...</kbd>
3. 选择下载的插件包（无需解压）
4. 首次安装后若未看到插件入口，重启一次 IDEA；后续版本更新通常免重启热生效（离线更新通道亦支持热替换）

</Steps>

## 第一个预览

安装完成后，在任何 MyBatis-Plus Wrapper 代码上：

1. 点代码左侧 gutter 的插件图标（它落在**变量声明行**上，如 `queryWrapper` 那一行）；也可以把光标**压在链内任一标识符上**（变量名、方法名都行）再按键
2. 按 <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>Q</kbd>（macOS <kbd>Option</kbd>+<kbd>Shift</kbd>+<kbd>Q</kbd>）
3. 弹窗显示生成的 SQL

::: tip 光标要落在标识符上，别停在行首缩进
快捷键触发时插件要求光标落在**具体的代码元素上**——变量名（如 `queryWrapper`）、方法名（如 `eq`）或链式调用的 `.list()` 都算；停在行首空白处只会得到一条「未在光标处找到可预览的 SQL 源」的提示；而链内 `.eq/.ge` 这类**中间行按设计没有 gutter 图标**（图标只标在变量声明行），所以点图标是更省心的入口。
:::



<GifPlayer src="/demo/wrapper-preview.gif" alt="Wrapper 预览演示：光标置于 Wrapper 链，弹窗实时生成 SQL" />

::: code-group

```java [Java 代码]
LambdaQueryWrapper<DeviceInfoEntity> wrapper = new LambdaQueryWrapper<DeviceInfoEntity>()
    .eq(DeviceInfoEntity::getId, 1001L)
    .isNotNull(DeviceInfoEntity::getStationId);
```

```sql [生成的 SQL]
SELECT id, station_id, share_scheme_id
FROM device_info_entity
WHERE id = 1001
    AND station_id IS NOT NULL
```

:::

看到 SQL 之后还可以再走一步：点预览面板的「执行计划」（英文界面 EXPLAIN）按钮，插件把当前 SQL 按方言包装成 EXPLAIN 语句提交原生数据库控制台，查看真实执行计划（需 IntelliJ IDEA Ultimate 且已配置数据源）。

## 下一步

- [配置详解](./configuration.md) — 了解所有可配置项
- [功能详解](../features/wrapper-preview.md) — 深入了解各项功能
- [常见问题 FAQ](./faq.md) — 排查使用中遇到的问题
