# JPA / Hibernate SQL Preview
<GifPlayer src="/demo/jpa-preview.svg" alt="JPA / Hibernate SQL Preview Demo" />

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
| `deleteAllInBatch` variants | the one bulk DELETE shape (no cascading, no callbacks) |
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

## hbm Named Queries

Named queries in Hibernate XML mappings (`.hbm.xml`) preview the same way: `<query>` (HQL) converts through the entity-to-table mapping, `<sql-query>` (native SQL) fills `:param` named parameters back as `?` placeholders. The query-name line gets a gutter icon — click it or use the shortcut to preview.

Java-side `session.createNamedQuery("Entity.method")` calls that don't match a `@NamedQuery` annotation automatically fall back to the same-named definition in `.hbm.xml`, so both HQL and native SQL get a preview.

## Known Limits

- `JpaSort.unsafe` function-injection shapes are not converted (safety boundary, annotated)
- Async returns (`CompletableFuture`) and Repository SPI implementations (e.g. Envers auditing) are out of preview scope

Related pages: [Wrapper → SQL Preview](/en/features/wrapper-preview), [SQL Log Tool Window](/en/features/sql-log) (Hibernate / JdbcTemplate log capture).

> Have a suggestion or hit an issue with this feature? [Go to the feedback pool](/en/about/feedback)
