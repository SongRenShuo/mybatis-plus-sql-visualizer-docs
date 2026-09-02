# SQL 日志工具窗口
<GifPlayer src="/demo/sql-log.png" alt="控制台日志还原演示" />

自动捕获运行控制台的 `Preparing:` / `Parameters:` 日志，还原成可执行 SQL，并可精确跳转到触发这条 SQL 的源码位置。

## 触发方式

侧边栏「MyBatis SQL Log」工具窗口 → 点击「捕捉」按钮开始监听。

## 功能特性

### 自动捕获

监听运行控制台的日志输出，识别 `Preparing:` 和 `Parameters:` 行，自动还原成完整 SQL。同时支持 Hibernate（`Hibernate:` + `binding parameter`）与 Spring JdbcTemplate 日志格式，默认开启。

### 混合前缀匹配

支持多种日志格式：
- `Preparing: SELECT ...`（MyBatis 默认）
- `==> Preparing: SELECT ...`（Spring Boot）
- 自定义前缀（设置页配置）

### SQL 高亮与耗时显示

- 列表中的 SQL 摘要按词法着色：关键字、表名、字符串、数字、注释分色显示，时间戳与耗时用灰色弱化，不抢 SQL 的视觉焦点
- 自动从日志中解析执行耗时，兼容 p6spy `elapsed`、MyBatis-Plus `Time:` 统计及自定义耗时前缀（设置页可配，默认 `Time:`）
- 耗时按阈值着色：小于 100ms 灰色、100ms 以上橙色、达到慢查询阈值（默认 1000ms，可配）红色
- 点击排序按钮可按耗时降序排列；存在慢查询时显示慢查询计数

### 跳转到源码

右键日志条目 →「跳转到源码」，行为分三级：

1. **精确跳转（推荐配置）**：SQL 日志本身不含调用位置，插件提供了可选的运行期拦截器方案——把插件自带的自包含示例 `SqlSourceInterceptor`（见插件仓库 `docs/instrumentation/SqlSourceInterceptor.kt`）复制到你的项目并注册为 MyBatis-Plus `InnerInterceptor`：

   ```java
   @Bean
   public MybatisPlusInterceptor mybatisPlusInterceptor() {
       MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
       // 限定你自己的业务包，调用点定位更准
       interceptor.addInnerInterceptor(new SqlSourceInterceptor(Set.of("com.example.")));
       // 分页等其他拦截器按需追加
       return interceptor;
   }
   ```

   拦截器在 SQL 执行线程捕获真实调用点，向控制台打印一行 `SQLVIS-SOURCE|相对路径|行号` 标记（不影响 SQL 执行、无性能负担），插件解析后即可像 SQL 历史面板一样精确 `file:line` 跳转——直达触发这条 SQL 的 Service / Controller 行
2. **按表名搜索（默认回退）**：未配置拦截器时，自动从 SQL 中提取表名并按表名搜索对应实体 / Wrapper 所在位置，多数场景可用但可能跳不准
3. **无表名**：如 `SELECT 1` 这类语句无可跳转目标，提示无法跳转

### 去重与过滤

| 功能 | 说明 |
|------|------|
| 去重窗口 | 相同 SQL 在窗口内重复不显示（默认 60000ms，可调） |
| 即时去重 | 勾选「移除重复的sql」后，窗口内已有的重复条目立即裁剪，并显示 `⨉N` 徽章标记丢弃数量 |
| 关键字过滤 | 移除包含指定关键字的日志行 |
| 时间戳显示 | 条目列表显示捕获时间 |

### 双击预览

双击日志条目 → 弹出 SQL 预览弹窗（同 Wrapper 预览弹窗，支持参数回填和格式化）。预览弹窗为非模态，执行 SQL 时如数据源密码过期，IDEA 的密码输入框可正常置顶输入。

## SQL 历史

勾选「自动保存历史 SQL」（设置页，默认关）后，超出列表上限被淘汰的条目自动写入保存文件，历史 tab 可随时回看：

- **一级（默认视图）**：文件列表，每行显示文件名、文件大小和 SQL 条数，搜索框按文件名过滤
- **二级（文件内容）**：双击文件进入，逐条展示该文件的 SQL（同样带高亮、耗时、时间戳与源码位置）；双击 SQL 打开预览，右键可复制 SQL 或跳转到源码；搜索框按 SQL 内容 / 源文件过滤
- **返回**：顶部「← 返回」回到文件列表；切换 tab 自动刷新，正在浏览的文件仍存在时不打断浏览

历史文件默认保存在项目 `.idea/sql-visualizer/sql-history/` 目录（v2026.9.2 起目录名由 `mybatis-plus-sql-visualizer` 改为 `sql-visualizer`，旧目录数据不再读取），保存目录与文件名模板均可在设置页自定义。
