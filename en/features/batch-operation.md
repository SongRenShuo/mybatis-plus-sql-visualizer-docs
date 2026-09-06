# Batch Operation Panel
<GifPlayer src="/demo/batch-operation.svg" alt="Batch Operation Panel Demo" />

`save` / `updateBatchById` / `saveOrUpdate` etc. — batch SQL expanded by column, with per-column parameter toggles.

## Trigger Method

When the Wrapper anchor involves batch operations, the dialog auto-switches to the batch parameter panel.

## Supported Batch Methods

| Method | Type | Description |
|--------|------|-------------|
| `save` | INSERT | Single insert |
| `saveBatch` | INSERT | Batch insert |
| `updateById` | UPDATE | Update by ID |
| `updateBatchById` | UPDATE | Batch update by ID |
| `saveOrUpdate` | UPSERT | Insert or update (conflict clause per dialect) |
| `saveOrUpdateBatch` | UPSERT | Batch insert or update |

## Parameter Panel

### Column-Level Toggles

- INSERT: All columns toggleable (auto-increment PK default off, aligning with MP runtime behavior)
- UPDATE: SET columns toggleable, WHERE PK + @Version fixed (cannot be unchecked)
- UPSERT: All columns including PK toggleable

### Quote Fill-in

Auto-determine quoting by field type:
- Numeric (Integer / Long / BigDecimal etc.) → no quotes
- String / datetime types → quoted
- Unknown type → panel NUMBER_REGEX heuristic

### Conflict Clause (UPSERT)

| Dialect | Conflict Clause |
|---------|----------------|
| MySQL / MariaDB | `ON DUPLICATE KEY UPDATE` |
| PostgreSQL | `ON CONFLICT (key) DO UPDATE SET` |
| SQL Server | `MERGE INTO` |
| Oracle | `MERGE INTO` |

> Have a suggestion or hit an issue with this feature? [Go to the feedback pool](/en/about/feedback?category=batch)

