---
title: "iBatis 2.x SQL Preview & Navigation"
description: "SQL preview for legacy iBatis 2.x (sqlMap) projects: #name# placeholders and 14 dynamic condition tags rendered with official-engine semantics, fillable parameters, and two-way navigation between sqlMap statements and Java DAO calls."
---

# iBatis 2.x SQL Preview & Navigation

iBatis 2.x `<sqlMap>` files get the same treatment as MyBatis mappers: statement preview, SQL injection highlighting, keyword completion, two-way navigation and interactive parameters — all served by a dedicated iBatis 2 rendering chain instead of the generic "embedded SQL in XML" fallback.

Rendering fidelity is golden-checked against the official iBatis 2.3.4.726 engine — values captured from the engine itself without a database, across 20 typical forms, byte-for-byte identical. That includes counter-intuitive behaviors such as "prepend concatenates verbatim without adding a space": a real run can produce glued text like `ANDORG_NAME`, and the preview reproduces it as-is rather than prettifying it.

## Trigger

A gutter icon appears on statement lines (`<select>` / `<insert>` / `<update>` / `<delete>` / `<statement>` / `<procedure>`) inside `<sqlMap>` files; click to preview.

File recognition requires two of three signals: root element `<sqlMap>`, a DOCTYPE matching an iBatis identifier, or `com.ibatis.sqlmap.client.SqlMapClient` on the classpath. Tag names overlap heavily between iBatis and MyBatis 3 (`<select>` / `<insert>` exist in both), so a MyBatis 3 `<mapper>` file is never misclassified as iBatis.

## Placeholders and dynamic tags

### Placeholder forms

| Form | Meaning |
|------|---------|
| `#name#` | Plain parameter placeholder |
| `#name:jdbcType#` | With JDBC type |
| `#name:jdbcType:nullValue#` | With JDBC type and null replacement |
| `#name,jdbcType=?` | Comma-style type notation |
| `$name$` | Raw string substitution (same injection risk as MyBatis `${}`; passes the existing confirmation gate) |

`##` / `$$` are treated as literals (escapes) and never take part in substitution.

### Dynamic tags

- **14 condition tags**: `isEqual` / `isNotEqual` / `isGreaterThan` / `isGreaterEqual` / `isLessThan` / `isLessEqual` / `isNull` / `isNotNull` / `isEmpty` / `isNotEmpty` / `isPropertyAvailable` / `isNotPropertyAvailable` / `isParameterPresent` / `isNotParameterPresent`
- `<dynamic>` `prepend` attributes consumed with official semantics
- `<iterate>` supports `open` / `conjunction` / `close` and `#ids[]#` index expansion
- `<sql>` / `<include>` fragments inlined at configuration time (the engine requires fragments to be declared before use; this renderer collects the whole file first, so forward references work silently)
- `<selectKey type="pre|post">` participates in rendering

## Parameter panel: toggleable conditions, fillable values

iBatis previews used to render a fixed no-parameter baseline — every `<dynamic>` condition off, an empty parameter panel. Parameters and condition rows are now generated per statement, and the SQL changes as you type:

- **Toggle conditions per row**: all 14 `<isXxx>` conditions listed row by row; check to expand into the WHERE, uncheck to collapse — same interaction as the OGNL panel for MyBatis
- **Fill values**: typing into a parameter row substitutes the placeholder live; `<iterate>` gets a value list (comma-separated, expanded as `ids[0..n-1]`)
- **Numeric comparison**: `compareValue="18"` compared against value `"9"` numerically — no more lexicographic misjudgment where `"9" > "18"` held true

For statements that declare a `<parameterMap>` and hand-write `?` in the body, parameter names align positionally to the `<parameter>` declarations — the panel shows real property names (`username` / `email`) instead of `param1..N`, and unconsumed declarations are flagged separately. Without a `<parameterMap>` the rows stay `param1..N` with a "parameter names unknown" note.

::: details Degraded-preview banner tiers (when: a banner appears)
When a segment cannot be rendered, the banner names the exact tag and reason (e.g. `<iterate property='ids'>` needs collection values) instead of silently producing a partial SQL with a misleading note. Banners come in two tiers — informational (ℹ) and failure (⚠ preview not fully restored) — each saying what it actually is. The banner follows re-renders: it disappears once values expand the condition, and returns at informational level when cleared.
:::

## Editor injection

- **Syntax highlighting**: statement text colored as SQL; the four placeholder forms (`#name#`, `#name:jdbcType#`, `#name:jdbcType:nullValue#`, `$name$`) are recognized in matched pairs and given accent backgrounds — an unclosed placeholder never swallows the text after it; `##` / `$$` are highlighted as literals
- **Completion**: typing `#` / `$` inserts the matching close; placeholder and keyword completion available
- **Folding**: dynamic tags fold by statement structure
- **Attribute values deliberately not injected**: `property` / `compareValue` / `refid` overlap heavily with MyBatis attribute names, and injecting them would change how `<mapper>` files behave — a deliberate boundary, not an omission

The two DTDs referenced by `<sqlMap>` (`sql-map-2.dtd` / `sql-map-config-2.dtd`) ship inside the plugin: the iBatis engine reads DTDs from the classpath offline, but the IDE resolves DOCTYPE external links, and `www.ibatis.com` died long ago — all 8 DOCTYPE identifiers map to the bundled copies, so legacy files open without waiting on timeouts.

## Two-way navigation

### id references inside the XML

`<include refid>` → the same file's `<sql id>`; `resultMap=` / `parameterMap=` / `<resultMap extends>` → the matching definitions. All soft references: nothing turns red when a target is missing, and no validator-like inspections are registered.

### Java DAO → XML statement

The first string argument of `SqlMapExecutor` entry methods (`queryForObject` / `queryForList` / `queryForMap` / `queryWithRowHandler` / `queryForPaginatedList` / `insert` / `update` / `delete`) jumps to the target statement's `id` attribute.

### Two-way arrows

The same jump arrows as MyBatis mapper files: a statement line's arrow lands on the Java DAO call argument, and a call line's arrow lands on the XML statement's `id` attribute; Ctrl+B / Ctrl+Click works without the arrows too.

::: details Coexisting with similar navigation plugins (when: MyBatisCodeHelperPro installed)
iBatis jump arrows are **not** affected by the "yield Mapper jump icons when a similar MyBatis navigation plugin is present" switch — competitors have no iBatis capability and never draw their own arrow on the same line, so there is no icon conflict: with both installed, this plugin's iBatis arrows always show. The yield switch only governs jump icons on MyBatis mapper files (see [XML / HQL Dynamic SQL Preview](./xml-preview)).
:::

::: details Recognition scope and limits (when: a jump does nothing or lands oddly)
- Navigation is **syntax-level**: method name + a string-literal first argument, without receiver type resolution. If the project happens to contain a non-iBatis method of the same name and a sqlMap statement with the same id, one mis-jump is possible; with no target, nothing happens.
- Cross-file id registries (parsing `<sqlMap resource>` from `sqlMapConfig`) and XML → Java reverse lookup are not in this release; cross-file `<include>` supports the same file and namespace fallback only.
- Kotlin DAO call forms and implicit `<selectKey>` ids (`<insertId>-SelectKey`) are not supported yet.
:::

## SQL log list

Entries from both capture channels carry a dedicated `IBATIS` source badge so display and filtering can tell them apart. The console channel recognizes iBatis `{pstm-N}` three-line log groups (`Executing Statement` + `Parameters` + `Types`), strips the structural brackets from the parameter list and merges types positionally to restore executable SQL (see [MyBatis Log to Real SQL](./sql-log)).

## Known limits

- iBatis batch processing is not supported in this release; parameter rows containing commas or nested brackets split on commas (`List.toString` is irreversible)
- Attribute values are deliberately not highlighted (see "Editor injection" above)
- Remaining navigation and cross-file limits are in the collapsible sections above

> Suggestions or issues? [Feedback pool](/en/about/feedback?category=xml)
