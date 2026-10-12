# Batch Operation Panel
<GifPlayer src="/demo/batch-operation.gif" alt="Batch Operation Panel Demo" />

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

For `saveOrUpdateBatch`, the per-column toggles and the conflict clause move together: uncheck a column in the "Parameter Columns" list on the left and it disappears from both the INSERT column list and the `ON DUPLICATE KEY UPDATE` section.

<GifPlayer src="/demo/batch-columns.gif" alt="Per-column toggles on the batch parameter panel: a saveOrUpdateBatch preview first renders INSERT INTO user (id, password, age, email, role_id, dept_id, status, username, ...) together with ON DUPLICATE KEY UPDATE password = VALUES(password), age = VALUES(age), email = VALUES(email), ...; after unchecking email in the Parameter Columns list, email disappears from both the INSERT column list and the ON DUPLICATE KEY UPDATE section, the checkbox goes back to unchecked and the button label switches from Uncheck All to Check All" />

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

## Batch Execution and Confirmation

When a multi-statement product restored by Log → SQL is executed in one click, a single statement runs directly; multiple statements pop up a candidate-check list to confirm before executing.

For multiple same-table equality deletes restored from a foreach batch delete, the confirmation popup shows a one-line merge hint: "Detected N same-table equality deletes that could be merged into DELETE ... WHERE id IN (...)". This is a preview hint only — execution still runs each statement as-is; with heterogeneous statements mixed in, the count is disclosed honestly as "N of M".

> Have a suggestion or hit an issue with this feature? [Go to the feedback pool](/en/about/feedback?category=batch)

