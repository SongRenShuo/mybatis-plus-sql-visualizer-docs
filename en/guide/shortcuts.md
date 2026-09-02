# Shortcuts & Triggers

Default key bindings for Windows / Linux and macOS, plus every entry point for each feature.

## Keyboard shortcuts

| Action | Windows / Linux | macOS |
|------|-----------------|-------|
| Wrapper / XML / annotation SQL preview | `Alt+Shift+Q` | `Option+Shift+Q` |
| SQL → Java reverse conversion | `Alt+Shift+J` | `Cmd+Shift+J` |
| Execute SQL from preview popup (Ultimate + Database plugin) | `Ctrl+Enter` | `Cmd+Enter` |

Bindings can be changed in `Settings` > `Keymap` by searching for the plugin action names.

## Other entry points

| Feature | Entry |
|------|------|
| SQL preview | Caret on a Wrapper chain / mapper statement → right-click `Convert to SQL`; or click the gutter icon |
| Annotation SQL preview | Gutter icon on `@Select` / `@Update` lines |
| SQL → Java | Select SQL text → context menu; or the sidebar tab in the tool window |
| SQL Log tool window | Bottom tool window bar; captures MyBatis console logs automatically |
| Batch operation parameter panel | Parameter panel inside the preview popup |

## Tips

- The preview popup is non-modal — you can keep editing code while inspecting SQL
- SQL → Java supports four target forms; results can be pasted straight back into your project
- On macOS, if `Option+Shift+Q` types a special character instead, your input source is intercepting it — rebind in Keymap
