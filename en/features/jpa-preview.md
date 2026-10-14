# JPA / Hibernate SQL Preview

<GifPlayer src="/demo/jpa-preview.gif" alt="JPA / Hibernate SQL Preview Demo" />

Static SQL preview for Spring Data JPA and Hibernate projects — Repository methods, JPQL / HQL, Criteria chains, `.hbm.xml` mappings. No Spring context, no database connection: click the gutter icon next to the line and get the SQL.

## Trigger Surfaces

| Entry | Location |
|-------|----------|
| Repository derived methods (`findByXxx...`) | method declaration line |
| Repository CRUD calls (`save` / `findById` / `deleteById` ...) | call line |
| `@Query("...")` annotations (JPQL / native SQL, incl. `@Modifying` DML) | annotation line |
| `@NamedQuery` / `@NamedQueries` entity-level queries | annotation line |
| JPA CriteriaQuery chains (`cq.from` / `cb.equal` ...) | chain line |
| `session.createQuery(hql)` and other Hibernate HQL calls | HQL string line |
| Custom DAO HQL query methods (e.g. `commonDao.findByQuery`) | call line |
| `.hbm.xml` mapped entities | resolved automatically |
| `.hbm.xml` named queries (`<query>` / `<sql-query>`) | query-name line |

The preview shortcut `Alt+Shift+Q` works on all of the above (cursor on the target line, same effect as clicking the icon).

## Repository CRUD Write Paths

Matching MyBatis-Plus `save` support, JPA Repository CRUD methods parse straight to SQL:

<GifPlayer src="/demo/jpa-write-path.gif" alt="Repository CRUD write-path preview: save yields an INSERT (with a left-hand Insert-columns checklist — unticking user.age drops that column from the INSERT list live), and deleteById yields a DELETE annotated with its per-entity EntityManager.remove semantics (not a bulk DELETE)" />

| Method | Rendering |
|--------|-----------|
| `save` / `saveAll` / `saveAndFlush` | INSERT for new entities, UPDATE for entities with an id (isNew check) |
| `findById` / `existsById` | primary-key equality / `SELECT 1 ... LIMIT 1` |
| `findAllById` | primary-key `IN (?, ?, ...)` expansion |
| `findAll` / `count` | full SELECT / `SELECT COUNT(*)` |
| `deleteById` / `delete` / `deleteAll` | per-entity `em.remove` semantics (select-then-delete, not bulk DELETE) |
| `deleteAllInBatch` and variants | the one bulk DELETE shape (no cascading, no callbacks) |
| `flush` | annotated form (dirty-check batch flush, no standalone SQL) |
| `getReferenceById` | annotated "no query" (lazy proxy sends no SQL by default) |

## Derived Query Deepening

<GifPlayer src="/demo/jpa-derived-query.gif" alt="Previewing derived methods in UserRepository one by one: findTop10ByOrderByCreateTimeDesc yields ORDER BY create_time DESC LIMIT 10; findByUsernameLike yields LIKE '%…%'; the Page-returning findByDepartmentIdAndStatus… yields a data SQL with a #pageSize/#pageOffset parameter panel (LIMIT ?, ?)" />

- All six method-name prefixes: `find` / `read` / `get` / `query` / `search` / `stream...By`
- `Top N` / `First N` / `Distinct` / multi-field `OrderBy<prop>Asc|Desc`
- Condition keywords: `Between`, the `Like` family (`StartingWith` / `Containing` etc., `%` auto-appended), `In` / `NotIn` (multi-value editing in the panel), `IsNull`, `True/False`, `IgnoreCase` (renders `LOWER(col)=LOWER(?)`)
- Return-type awareness: `Page<T>` yields both count SQL and data SQL, `Slice<T>` fetches one extra row, `Stream<T>` gets a consume-within-transaction note

## Pagination & Sorting

`Pageable` / `Sort` arguments take part in rendering: `PageRequest.of(0, 20, Sort.by(...))` becomes `LIMIT 20 OFFSET 0` plus `ORDER BY`, emitted in the current dialect's pagination syntax.

## Specification & QueryByExample

- `JpaSpecificationExecutor` `findAll(Specification)` chains: `root.get` / `cb.equal` / `cb.and` combinations resolve into WHERE conditions
- `QueryByExampleExecutor`: `Example.of(probe)` builds equality conditions from the probe's non-null fields (`ExampleMatcher` customizers participate)

<GifPlayer src="/demo/jpa-criteria.gif" alt="Static preview of a CriteriaBuilder composite condition: with the caret on the cq.where(cb.and(...)) call line the preview opens, listing #username / #ageStart / #ageEnd / #statuses parameter boxes on the left while the SQL on the right translates cb.like / cb.between / cb.in / cb.isNull / cb.not and cb.and/or one by one into WHERE username LIKE ? AND age BETWEEN ? AND ? AND status IN (?) AND email IS NULL AND NOT (status = 0) ..." />

## JPQL / HQL Deepening

- JOIN resolution: association paths expand into real ON conditions via entity mappings; the JOIN diagram works too
- Subqueries, aggregates, `UPDATE` / `DELETE` JPQL (incl. `@Modifying`) fully supported
- Bare entity alias in `SELECT u` auto-expands to the column list (see [XML / HQL Dynamic SQL Preview](/en/features/xml-preview))
- Alias-free HQL maps as well: bare properties like `WHERE stationCode = ?` convert to column names (`STATION_CODE = ?`), and embedded segments (e.g. `updateInfo.BE_DELETE`) occupying the qualifier position produce bare column names per the embedded mapping — matching real Hibernate semantics

## JPA Parameter Chains (setParameter)

<GifPlayer src="/demo/jpa-param-chain.gif" alt="Previewing a setParameter chain: literals and enum constants already prefill the parameter boxes, a duplicate parameter name gets a grey hint, and typing a value into a formal parameter turns its placeholder into the real value immediately" />

Chained `em.createQuery(...).setParameter(...)` calls fully take part in the preview, and the parameter panel stays consistent with the rendered SQL:

- **Auto-prefill for literals and enum constants**: calls whose argument is a literal or enum constant (`setParameter("status", OrderStatus.PAID)`) prefill the parameter box automatically — no manual typing
- **Fill by name**: named placeholders (`:status` and the like) are matched by parameter name, and the same name reuses the same value; both rendering and "Copy executable SQL" are decoupled from the order of `setParameter` calls, with a conservative positional fallback when positional parameters are mixed in
- **Duplicate-name notice**: setting the same parameter name multiple times via `setParameter` shows a gray hint at the tail of the parameter area (the last value wins at runtime)

## Embedded Value Objects (@Embedded)

Fields of embedded value objects (`@Embedded` / `@Embeddable` / `@EmbeddedId`) are flattened into the owner table's columns and take part in the preview.

Camel-case embedded paths in derived method names (`findByUpdateInfoCreatedTimeAfter` and the like) also resolve to the real flattened column — WHERE / ORDER BY no longer produce pseudo columns like `update_info_created_time`.

<GifPlayer src="/demo/jpa-embedded.gif" alt="Derived-query preview over nested embeds: address.zipcode.zip flattens segment by segment to cust_zip, and bizAddress.street flattens under its prefix to biz_street (the prefix is applied once — no biz_biz_street)" />

::: details Flattening rules in detail (When to read: an embedded field's column name doesn't match expectations)
- Nested `@AttributeOverride` supports the JPA-spec dot-path form (`name="zipcode.zip"`) — dot paths take priority with bare-name fallback, and class-level override keys propagate down the nesting chain
- Spring Data shapes: a bare `@Embedded` flattens column names under its `prefix`, and the `@Embedded.Nullable` / `@Embedded.Empty` shortcut annotations are recognized (multiple embeds of the same value object expand under their own prefixes, no collisions)
- Embedded-segment resolution for derived queries covers WHERE / ORDER BY (including `Sort.by` literal properties); full SELECT expansion and the `@Query` JPQL path were already correct
- Nested dot paths resolve **segment by segment** (`address.zipcode.zip` → the overridden column `cust_zip`), so intermediate segments (`Zipcode`) take part in the match instead of degrading into an underscore-joined pseudo column
- When `prefix` and `@AttributeOverride` meet, **the override name is the final column name** — `prefix` is only prepended to columns with no override declaration, so doubles like `biz_biz_street` cannot occur
- Mixed-annotation entities with MyBatis-Plus and jakarta embed annotations coexisting (`@TableName` + `@Embedded`) flatten into owner-table columns in Wrapper preview, batch templates and CRUD generation as well — value-object pseudo columns are gone there too
:::

## Inheritance-Chain Entity Column Resolution

When an entity extends a parent class (including abstract classes), HQL / JPQL previews still resolve the full column list — parent-mapped columns are included, and resolution no longer degrades to `x.*` just because the column list came back empty; custom entity names from `@Entity(name = "...")` resolve back to the entity class as well.

::: details Inheritance strategies and degradation notes (When to read: JOINED / TABLE_PER_CLASS mappings or a degradation comment shows up)
Under `@Inheritance(JOINED)` / `TABLE_PER_CLASS`, parent fields actually live in the parent table or per-class tables; the preview merges the column list on a single-table basis and attaches a boundary note. When an entity truly can't be resolved, the degradation comment comes in two flavors — "entity unresolvable" and "entity resolvable but column list empty (check the parent mappings along the inheritance chain)" — so diagnosis points in the right direction.
:::

## hbm Named Queries

Named queries in Hibernate XML mappings (`.hbm.xml`) preview the same way: `<query>` (HQL) converts through the entity-to-table mapping, `<sql-query>` (native SQL) fills `:param` named parameters back as `?` placeholders. The query-name line gets a gutter icon — click it or use the shortcut to preview.

Java-side `session.createNamedQuery("Entity.method")` calls that don't match a `@NamedQuery` annotation automatically fall back to the same-named definition in `.hbm.xml`, so both HQL and native SQL get a preview.

## Known Limits

- `JpaSort.unsafe` function-injection shapes are not converted (safety boundary, annotated)
- Async returns (`CompletableFuture`) and Repository SPI implementations (e.g. Envers auditing) are out of preview scope

Related pages: [Wrapper → SQL Preview](/en/features/wrapper-preview), [SQL Log Tool Window](/en/features/sql-log) (Hibernate / JdbcTemplate log capture).

> Have a suggestion or hit an issue with this feature? [Go to the feedback pool](/en/about/feedback)
