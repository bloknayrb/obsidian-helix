# Code Separation Analysis: obsidian-helix → codemirror-helix

## Analysis Results (2026-01-05)

Tested against codemirror-helix v0.5.1 (latest).

## What Should Move Upstream

### Files to Contribute
- `helix-commands.ts` (618 lines) - Command implementations
- `helix-keymap.ts` (131 lines) - Key bindings

**Total:** ~750 lines of generic CodeMirror code

### Dependencies
```typescript
// Only uses standard CodeMirror packages:
import { EditorView } from '@codemirror/view'
import { EditorSelection, SelectionRange, ChangeSpec } from '@codemirror/state'
import { deleteToLineStart, ... } from '@codemirror/commands'
```

Zero Obsidian dependencies.

## What Stays in obsidian-helix

### Files (Obsidian-specific)
- `main.ts` (146 lines) - Plugin integration only
  - Settings UI
  - Plugin lifecycle
  - Extension registration
  - Obsidian Notice/Settings API usage

## Command Status Matrix

| Command | Type | In v0.5.1? | Notes |
|---------|------|-----------|-------|
| `e` | Word movement | Broken | Exists but same as `w` |
| `W` | Word movement | No | - |
| `B` | Word movement | No | - |
| `E` | Word movement | No | - |
| `s` | Selection | Conflict | Used for search in v0.5.1 |
| `S` | Selection | No | - |
| `Alt-s` | Selection | **Yes** | Duplicate - can remove |
| `X` | Selection | No | Lowercase `x` exists |
| `C` | Editing | No | - |
| `G` | Goto | Partial | `g e` exists, `G` more convenient |
| Insert mode (6) | Editing | No | All missing |

**Summary:**
- 1 redundant (Alt-s)
- 1 conflict (s)
- 14 needed (88%)

## Technical Details

### Mode Detection Issue
Current implementation uses workaround:
```typescript
// Hacky: iterates through state fields to find helix mode
function isInsertMode(view: EditorView): boolean {
  for (const key of Object.keys(state)) {
    const value = state[key];
    if (value?.type === 1) return true; // 1 = Insert mode
  }
  return false;
}
```

**Recommendation:** Expose mode state as public API in codemirror-helix.

### Build Compatibility
✅ Builds successfully with v0.5.1
✅ No TypeScript errors
✅ No runtime dependencies on Obsidian

## Contribution Strategy

### Option A: Full Contribution (Recommended)
1. Submit proposal to codemirror-helix maintainer
2. If accepted: prepare PR with all commands
3. Update obsidian-helix to import from upstream
4. Remove local implementations

### Option B: Incremental
1. Start with word movement commands (most used)
2. Then selection commands
3. Then editing commands
4. Finally insert mode commands

### Option C: Keep as Polyfill
If upstream is unresponsive:
- Document as temporary polyfill
- Mark with TODO comments
- Reconsider if maintenance changes

## Next Steps

- [x] Upgrade to v0.5.1
- [x] Analyze feature overlap
- [x] Verify build compatibility
- [ ] Contact maintainer with proposal
- [ ] Submit PR if accepted
- [ ] Update plugin after upstream merge

## Contact Info

Maintainer: Roberto Vidal
Repository: https://gitlab.com/_rvidal/codemirror-helix
Issues: https://gitlab.com/_rvidal/codemirror-helix/issues
Email: roberto.vidal@ikumene.com (from npm package)
