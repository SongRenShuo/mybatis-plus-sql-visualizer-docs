# 快速开始

3 分钟上手 SQL Visualizer。

## 安装插件

<Steps :title="''">

### 方式一：IDE 内置插件系统安装（推荐）

1. 打开 <kbd>Settings/Preferences</kbd> > <kbd>Plugins</kbd> > <kbd>Marketplace</kbd>
2. 搜索 `SQL Visualizer`
3. 点击 <kbd>Install</kbd> 安装
4. 重启 IDE 生效

### 方式二：手动下载插件安装

1. 在 [JetBrains Marketplace](https://plugins.jetbrains.com/plugin/33633-sql-visualizer) 或 [Gitee Releases](https://gitee.com/songrenshuo/mybatis-plus-sql-visualizer/releases) 下载插件包
2. 进入 IDE，打开 <kbd>Settings</kbd> > <kbd>Plugins</kbd> > <kbd>⚙</kbd> > <kbd>Install Plugin from Disk...</kbd>
3. 选择下载的插件包（无需解压）
4. 重启 IDE 生效

</Steps>

## 第一个预览

安装完成后，在任何 MyBatis-Plus Wrapper 代码上：

1. 点代码左侧 gutter 的插件图标（它落在**变量声明行**上，如 `queryWrapper` 那一行）；也可以把光标**压在链内任一 token 上**再按键
2. 按 <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>Q</kbd>（macOS <kbd>Option</kbd>+<kbd>Shift</kbd>+<kbd>Q</kbd>）
3. 弹窗显示生成的 SQL

::: tip 光标要压在 token 上，别停在行首缩进
快捷键触发时插件要求光标落在**代码 token** 上（如变量名 `queryWrapper`、方法名 `eq`、链式调用的 `.list()`）。停在行首空白处只会得到一条「未在光标处找到可预览的 SQL 源」的提示；而链内 `.eq/.ge` 这类**中间行按设计没有 gutter 图标**（图标只标在变量声明行），所以点图标是更省心的入口。
:::



<GifPlayer src="/demo/wrapper-preview.gif" alt="Wrapper 预览演示：光标置于 Wrapper 链，弹窗实时生成 SQL" />

<code-group>
<div title="Java 代码">

```java
LambdaQueryWrapper<DeviceInfoEntity> wrapper = new LambdaQueryWrapper<DeviceInfoEntity>()
    .eq(DeviceInfoEntity::getId, 1001L)
    .isNotNull(DeviceInfoEntity::getStationId);
```

</div>
<div title="生成的 SQL">

```sql
SELECT id, station_id, share_scheme_id
FROM device_info_entity
WHERE id = 1001
    AND station_id IS NOT NULL
```

</div>
</code-group>

看到 SQL 之后还可以再走一步：点预览面板的「执行计划」（英文界面 EXPLAIN）按钮，插件把当前 SQL 按方言包装成 EXPLAIN 语句提交原生数据库控制台，查看真实执行计划（需 IntelliJ IDEA Ultimate 且已配置数据源）。

## 下一步

- [配置详解](./configuration.md) — 了解所有可配置项
- [功能详解](../features/wrapper-preview.md) — 深入了解各项功能
- [常见问题 FAQ](./faq.md) — 排查使用中遇到的问题
