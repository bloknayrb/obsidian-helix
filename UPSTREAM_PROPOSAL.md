# Proposal: Add Missing Helix Movement and Selection Commands

## Summary

codemirror-helix v0.5.1 is missing several standard Helix commands. I have working implementations in TypeScript that use only CodeMirror APIs (no external dependencies). Would you accept a contribution adding these?

## Missing Commands

### Word Movement (4 commands)
- `e` - Move to next word end (currently broken - does same as `w`)
- `W` - Move to next WORD start (whitespace-delimited)
- `B` - Move to previous WORD start
- `E` - Move to next WORD end

### Selection (2 commands)
- `S` - Split selection on whitespace
- `X` - Extend selection to line bounds (uppercase version of existing `x`)

### Editing (2 commands)
- `C` - Copy selection to next line
- `G` - Go to last line (shortcut for existing `g e`)

### Insert Mode (6 commands)
- `Ctrl-w` - Delete word backward
- `Alt-d` - Delete word forward
- `Ctrl-u` - Delete to line start
- `Ctrl-k` - Delete to line end
- `Ctrl-h` - Delete char backward
- `Ctrl-d` - Delete char forward

## Implementation Status

All commands are implemented and tested in production use (obsidian-helix plugin). Code:
- Uses only `@codemirror/state`, `@codemirror/view`, `@codemirror/commands`
- ~750 lines of TypeScript
- No external dependencies
- Compatible with existing helix mode system

## Known Issues

### Command Conflicts
- `s` - Current PR uses this for "select word at cursor", but v0.5.1 uses it for search input. Would need to pick one or use different key.

### Mode Detection
Current implementation uses a workaround to detect insert mode (iterates through state fields). A proper exported API for mode detection would be cleaner:
```typescript
export function getMode(state: EditorState): ModeState
```

## Files

Implementation can be provided as:
1. Single PR with all commands, or
2. Incremental PRs (word movement → selection → editing → insert mode)

## License

Code is MIT licensed, compatible with MPL-2.0.

## Questions

1. Are you interested in these additions?
2. Preferred contribution format (single PR vs incremental)?
3. Should `s` remain as search or change to select-word?
4. Can mode detection be exposed as public API?

---

Reference implementation: https://github.com/obsidian-helix/obsidian-helix
Contact: [your contact info]
