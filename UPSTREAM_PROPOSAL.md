# Proposal: Add Missing Helix Movement and Selection Commands

## Summary

codemirror-helix v0.5.1 is missing several standard Helix commands. I have working implementations that match your internal architecture exactly - they use your helper functions (cmdCount, mapSel, resetCount), integrate with your mode system, and follow your coding patterns. Would you accept a contribution?

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

All commands are implemented and tested in production (obsidian-helix plugin). The code has been refactored to match your architecture:
- Uses your internal helpers: `cmdCount()`, `mapSel()`, `resetCount()`
- Integrates with `MODE_EFF` constants and mode system
- Follows your checkpoint pattern for undo/redo
- Handles both Normal and Select modes correctly
- ~450 lines of TypeScript (refactored from original)
- Only depends on `@codemirror` packages you already use
- Ready to copy directly into `src/lib.ts`

**Files provided:**
- `upstream-commands.ts` - Refactored commands matching your patterns
- `INTEGRATION_GUIDE.md` - Step-by-step integration instructions

## Known Issues

### Command Conflicts
- `s` - Current PR uses this for "select word at cursor", but v0.5.1 uses it for search input. Would need to pick one or use different key.

### Mode Detection
The refactored commands receive the `mode` parameter directly (following your pattern), eliminating the need for workarounds. Insert mode commands are placed in `helixCommandBindings.insert` which automatically ensures they only run in insert mode.

## Contribution Format

**Option 1: Direct integration** (recommended)
- Commands are already written to match your codebase structure
- Follow INTEGRATION_GUIDE.md to copy into `src/lib.ts`
- Estimated integration time: 30-60 minutes

**Option 2: Pull request**
- I can submit PR with commands pre-integrated
- Can be single PR or incremental (word movement → selection → editing → insert mode)

**Option 3: Review first**
- Review `upstream-commands.ts` to see if approach fits
- Provide feedback on any changes needed
- Then proceed with Option 1 or 2

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
