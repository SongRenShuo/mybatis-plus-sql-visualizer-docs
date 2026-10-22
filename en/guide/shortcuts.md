# Shortcuts & Triggers

Default key bindings for Windows / Linux and macOS, plus every entry point for each feature.

## Keyboard shortcuts

| Action | Windows / Linux | macOS |
|------|-----------------|-------|
| SQL preview (Wrapper / XML / annotation / HQL·JPQL / custom DAO HQL / JdbcTemplate / `@NamedQuery` / `.hbm.xml` named queries / string SQL in method bodies) | `Alt+Shift+Q` | `Option+Shift+Q` |
| SQL → Java reverse conversion | `Alt+Shift+J` | `Cmd+Shift+J` |
| Execute SQL from preview popup (Ultimate + Database plugin) | `Ctrl+Enter` | `Cmd+Enter` |

Bindings can be changed in `Settings` > `Keymap` by searching for the plugin action names.

## Other entry points

| Feature | Entry |
|------|------|
| SQL preview | Caret on a Wrapper chain / mapper statement → right-click `Convert to SQL`; or the gutter icon (left-click previews, right-click offers "Recent Executions") |
| Annotation SQL preview | Gutter icon on `@Select` / `@Update` lines |
| JPA / Hibernate preview | Gutter icon on derived methods / CRUD calls / `@Query` / `@NamedQuery` / Criteria chains / `.hbm.xml` named queries |
| EXPLAIN plan | "EXPLAIN" button in the preview panel button row |
| SQL quick templates (EXPLAIN / COUNT / 10-row sample) | Select a table name in a mapper XML or the preview editor → the "SQL quick templates" context menu; no default shortcut — bind your own in the plugin's "Shortcuts" settings section or in Keymap |
| SQL → Java | Select SQL text → context menu; or the sidebar tab in the tool window |
| SQL Log tool window | Bottom tool window bar; captures MyBatis console logs automatically, with an optional "auto-start listening on project launch" setting |
| Batch operation parameter panel | Parameter panel inside the preview popup |
| Copy SQL and Close | Blue primary action at the bottom of the preview panel (copies the current SQL and closes the panel) |
| Estimate affected rows | Preview panel "More" menu (UPDATE / DELETE only) |
| Export replay script / Export portable SQL | Preview panel "More" menu |
| Copy as AI Context | Preview panel "More" menu (there is also a "with identifiers" variant) |
| One-click diagnostic report | Preview panel "More" → "Share" → copy / export diagnostic report |
| History: jump to last entry | "↓≡" action in the SQL History second-level toolbar |
| Join the community | Chat-bubble icon at the far right of the SQL Log toolbar |

## Tips

- The preview popup is non-modal — you can keep editing code while inspecting SQL
- SQL → Java supports four target forms; results can be pasted straight back into your project
- Ctrl+C means the same thing in every surface with a SQL editor: no selection copies the whole SQL, a selection copies just the fragment (Ctrl+Insert is a synonym); on a list it copies the plain SQL rather than the rendered text
- On macOS, if `Option+Shift+Q` types a special character instead, your input source is intercepting it — rebind in Keymap
