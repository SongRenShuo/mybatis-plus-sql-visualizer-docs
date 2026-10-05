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

- All six method-name prefixes: `find` / `read` / `get` / `query` / `search` / `stream...By`
- `Top N` / `First N` / `Distinct` / multi-field `OrderBy<prop>Asc|Desc`
- Condition keywords: `Between`, the `Like` family (`StartingWith` / `Containing` etc., `%` auto-appended), `In` / `NotIn` (multi-value editing in the panel), `IsNull`, `True/False`, `IgnoreCase` (renders `LOWER(col)=LOWER(?)`)
- Return-type awareness: `Page<T>` yields both count SQL and data SQL, `Slice<T>` fetches one extra row, `Stream<T>` gets a consume-within-transaction note

## Pagination & Sorting

`Pageable` / `Sort` arguments take part in rendering: `PageRequest.of(0, 20, Sort.by(...))` becomes `LIMIT 20 OFFSET 0` plus `ORDER BY`, emitted in the current dialect's pagination syntax.

## Specification & QueryByExample

- `JpaSpecificationExecutor` `findAll(Specification)` chains: `root.get` / `cb.equal` / `cb.and` combinations resolve into WHERE conditions
- `QueryByExampleExecutor`: `Example.of(probe)` builds equality conditions from the probe's non-null fields (`ExampleMatcher` customizers participate)

## JPQL / HQL Deepening

- JOIN resolution: association paths expand into real ON conditions via entity mappings; the JOIN diagram works too
- Subqueries, aggregates, `UPDATE` / `DELETE` JPQL (incl. `@Modifying`) fully supported
- Bare entity alias in `SELECT u` auto-expands to the column list (see [XML / HQL Dynamic SQL Preview](/en/features/xml-preview))
- Alias-free HQL maps as well: bare properties like `WHERE stationCode = ?` convert to column names (`STATION_CODE = ?`), and embedded segments (e.g. `updateInfo.BE_DELETE`) occupying the qualifier position produce bare column names per the embedded mapping — matching real Hibernate semantics

## Embedded Value Objects (@Embedded)

Fields of embedded value objects (`@Embedded` / `@Embeddable` / `@EmbeddedId`) are flattened into the owner table's columns and take part in the preview, and camel-case embedded paths in derived method names (`findByUpdateInfoCreatedTimeAfter` and the like) also resolve to the real flattened column — WHERE / ORDER BY no longer produce pseudo columns like `update_info_created_time`.

::: details Flattening rules in detail (When to read: an embedded field's column name doesn't match expectations)
- Nested `@AttributeOverride` supports the JPA-spec dot-path form (`name="zipcode.zip"`) — dot paths take priority with bare-name fallback, and class-level override keys propagate down the nesting chain
- Spring Data shapes: a bare `@Embedded` flattens column names under its `prefix`, and the `@Embedded.Nullable` / `@Embedded.Empty` shortcut annotations are recognized (multiple embeds of the same value object expand under their own prefixes, no collisions)
- Embedded-segment resolution for derived queries covers WHERE / ORDER BY (including `Sort.by` literal properties); full SELECT expansion and the `@Query` JPQL path were already correct
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
