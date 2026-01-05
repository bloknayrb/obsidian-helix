# Integration Guide: Adding Commands to codemirror-helix

This document explains how to integrate the additional Helix commands from `upstream-commands.ts` into the codemirror-helix library.

## Overview

The commands in `upstream-commands.ts` are written to match codemirror-helix's internal architecture exactly. They can be directly copied into the library's source code.

## File Structure

```
codemirror-helix/
├── src/
│   └── lib.ts          ← Main file with helixCommandBindings
└── dist/
    └── lib.js          ← Compiled output
```

## Integration Steps

### 1. Add Commands to Normal Mode

Open `src/lib.ts` and locate `helixCommandBindings.normal`. Merge in commands from `additionalNormalCommands`:

```typescript
const helixCommandBindings = {
  // ... existing code ...

  normal: {
    // ... existing normal mode commands ...

    // Additional WORD movement commands
    ["W"](view, mode) {
      // Copy from upstream-commands.ts
    },

    ["B"](view, mode) {
      // Copy from upstream-commands.ts
    },

    ["E"](view, mode) {
      // Copy from upstream-commands.ts
    },

    // Additional selection commands
    ["S"](view) {
      // Copy from upstream-commands.ts
    },

    ["X"](view, mode) {
      // Copy from upstream-commands.ts
    },

    // Additional editing commands
    ["C"]: {
      checkpoint: true,
      command(view) {
        // Copy from upstream-commands.ts
      }
    },

    ["G"](view, mode) {
      // Copy from upstream-commands.ts
    }
  }
};
```

### 2. Add Commands to Insert Mode

Locate `helixCommandBindings.insert` and add insert mode commands:

```typescript
const helixCommandBindings = {
  // ... existing code ...

  insert: {
    // ... existing insert mode commands ...

    ["Ctrl-w"](view) {
      // Copy from upstream-commands.ts
    },

    ["Alt-d"](view) {
      // Copy from upstream-commands.ts
    },

    ["Ctrl-u"]: deleteToLineStart,
    ["Ctrl-k"]: deleteToLineEnd,
    ["Ctrl-h"]: deleteCharBackward,
    ["Ctrl-d"]: deleteCharForward
  }
};
```

### 3. Verify Imports

Ensure these imports are present at the top of `src/lib.ts`:

```typescript
import {
  deleteToLineStart,
  deleteToLineEnd,
  deleteCharBackward,
  deleteCharForward
} from "@codemirror/commands";
```

### 4. Build and Test

```bash
npm run build
npm test
```

## Command Details

### Normal Mode Commands

| Key | Command | Description | Uses Checkpoint |
|-----|---------|-------------|-----------------|
| `W` | Move next WORD | Whitespace-delimited word movement | No |
| `B` | Move prev WORD | Whitespace-delimited word movement | No |
| `E` | Move WORD end | Whitespace-delimited word end | No |
| `S` | Split selection | Split on whitespace | No |
| `X` | Extend line bounds | Like `x` but includes newline | No |
| `C` | Copy line down | Duplicate line(s) below | **Yes** |
| `G` | Goto last line | Go to end or line number | No |

### Insert Mode Commands

| Key | Command | Description | Source |
|-----|---------|-------------|--------|
| `Ctrl-w` | Delete word back | Delete to word start | Custom |
| `Alt-d` | Delete word forward | Delete to word end | Custom |
| `Ctrl-u` | Delete to line start | Kill line before cursor | Built-in |
| `Ctrl-k` | Delete to line end | Kill line after cursor | Built-in |
| `Ctrl-h` | Delete char back | Same as Backspace | Built-in |
| `Ctrl-d` | Delete char forward | Same as Delete | Built-in |

## Helper Functions Used

These functions already exist in codemirror-helix:

- `cmdCount(mode)` - Get repeat count from mode
- `resetCount(mode)` - Clear repeat count
- `mapSel(selection, mapper)` - Map selection ranges
- `MODE_EFF.NORMAL` - Normal mode effect
- `MODE_EFF.SELECT` - Select mode effect

## Testing Checklist

After integration, test:

- [ ] `W`, `B`, `E` movement with and without count (e.g., `3W`)
- [ ] `S` splits on whitespace correctly
- [ ] `X` extends to include newline
- [ ] `C` duplicates lines with undo/redo
- [ ] `G` goes to last line, `5G` goes to line 5
- [ ] Insert mode: `Ctrl-w`, `Alt-d`, `Ctrl-u`, `Ctrl-k` work correctly
- [ ] Commands work in both Normal and Select modes
- [ ] Undo/redo works correctly (especially for `C`)

## Known Issues

### Mode Detection for Insert-Only Commands

Insert mode commands (`Ctrl-u`, `Ctrl-k`, etc.) may conflict with normal mode if not properly guarded. Current implementation assumes they're only active in insert mode bindings.

**Solution:** Commands are placed in `helixCommandBindings.insert`, which ensures they only run in insert mode.

### Alt-d Conflict

`Alt-d` exists in both:
- Normal mode (delete without yank) - already in codemirror-helix
- Insert mode (delete word forward) - new addition

**Solution:** No conflict - different mode contexts. Insert mode binding only activates when in insert mode.

## License Compatibility

All code is compatible with codemirror-helix's MPL-2.0 license:
- Original implementation: MIT (obsidian-helix)
- MIT → MPL-2.0: Compatible (can be relicensed)

## Questions?

For questions about integration:
1. Check this guide first
2. Review `upstream-commands.ts` comments
3. Compare with existing commands in `src/lib.ts`
4. Open an issue on GitLab if stuck

## Version History

- **2026-01-05**: Initial integration guide created
- Commands tested against codemirror-helix v0.5.1
