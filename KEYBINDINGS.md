# Additional Helix Keybindings

This document lists the additional Helix keybindings that have been implemented to supplement the core `codemirror-helix` extension. These keybindings can be toggled on/off in the plugin settings.

## Overview

The `codemirror-helix` extension provides a solid foundation of Helix keybindings, but some commands from the official Helix editor were missing. This plugin now includes those missing keybindings to provide a more complete Helix editing experience in Obsidian.

## Additional Keybindings

### Normal Mode - Word Movement

| Key | Command | Description |
|-----|---------|-------------|
| `e` | move_next_word_end | Move cursor to the end of the next word |
| `W` | move_next_long_word_start | Move to the start of the next WORD (whitespace-delimited) |
| `B` | move_prev_long_word_start | Move to the start of the previous WORD (whitespace-delimited) |
| `E` | move_next_long_word_end | Move to the end of the next WORD (whitespace-delimited) |

**Note:** In Helix, a "word" is delimited by word boundaries (e.g., punctuation, whitespace), while a "WORD" is only delimited by whitespace.

### Normal Mode - Selection

| Key | Command | Description |
|-----|---------|-------------|
| `s` | select_regex | Select text matching a pattern (currently selects word at cursor) |
| `S` | split_selection | Split selection on whitespace |
| `Alt-s` | split_selection_on_newline | Split selection into multiple selections at each newline |
| `X` | extend_to_line_bounds | Extend current selection to encompass full lines |

### Normal Mode - Editing

| Key | Command | Description |
|-----|---------|-------------|
| `C` | copy_selection_on_next_line | Duplicate the current line(s) to the next line |
| `=` | format_selections | Format the selected text (placeholder - needs formatter integration) |
| `G` | goto_line | Go to the last line of the document |

### Insert Mode - Enhanced Editing

| Key | Command | Description |
|-----|---------|-------------|
| `Ctrl-w` | delete_word_backward | Delete the word before the cursor |
| `Alt-d` | delete_word_forward | Delete the word after the cursor |
| `Ctrl-u` | kill_to_line_start | Delete from cursor to start of line |
| `Ctrl-k` | kill_to_line_end | Delete from cursor to end of line |
| `Ctrl-h` | delete_char_backward | Delete character before cursor (same as Backspace) |
| `Ctrl-d` | delete_char_forward | Delete character after cursor (same as Delete) |

## Already Implemented by codemirror-helix

The following keybindings are already provided by the `codemirror-helix` extension:

### Normal Mode - Basic Movement
- `h`, `j`, `k`, `l` - Move left, down, up, right
- `w`, `b` - Move to next/previous word start
- Arrow keys - Directional movement
- `Home`, `End` - Move to line start/end
- `PageUp`, `PageDown` (or `Ctrl-u`, `Ctrl-d`) - Half-page scroll

### Normal Mode - Find/Replace
- `f`, `F` - Find next/previous character
- `t`, `T` - Till next/previous character
- `r` - Replace character
- `R` - Replace with yanked text

### Normal Mode - Selection
- `v` - Toggle visual/select mode
- `%` - Select all
- `x` - Extend line selection
- `;` - Collapse selection to cursor
- `Alt-;` - Flip selection direction
- `Alt-:` - Ensure selections are forward

### Normal Mode - Text Manipulation
- `d` - Delete selection
- `Alt-d` - Delete selection without yanking
- `c` - Change selection (delete and enter insert mode)
- `Alt-c` - Change selection without yanking
- `y` - Yank (copy) selection
- `p` - Paste after
- `P` - Paste before
- `J` - Join lines
- `>`, `<` - Indent/unindent
- `~` - Toggle case
- `` ` `` - Convert to lowercase
- ``Alt-` `` - Convert to uppercase

### Normal Mode - Insert Modes
- `i` - Enter insert mode before cursor
- `I` - Enter insert mode at line start
- `a` - Enter insert mode after cursor
- `A` - Enter insert mode at line end
- `o` - Open new line below and enter insert mode
- `O` - Open new line above and enter insert mode

### Normal Mode - Undo/Redo
- `u` - Undo
- `U` - Redo

### Normal Mode - Search
- `/` - Start forward search
- `n` - Find next match
- `N` - Find previous match
- `*` - Use selection as search pattern

### Goto Mode (press `g` first)
- `g` - Go to file start
- `e` - Go to file end
- `h` - Go to line start
- `l` - Go to line end
- `j`, `k` - Go to next/previous line with scroll
- `n` - Go to next buffer
- `p` - Go to previous buffer

### Space Leader Commands (press `Space` first)
- `y` - Yank to system clipboard
- `p` - Paste from system clipboard after
- `P` - Paste from system clipboard before
- `R` - Replace with system clipboard
- `f` - File picker (if configured)
- `b` - Buffer picker (if configured)
- `/` - Global search (if configured)

### Match Mode (press `m` first)
- `s` - Surround selection with character pair
- `m` - Go to matching bracket

### Bracket Commands
- `[Space` - Insert blank line above
- `]Space` - Insert blank line below

### Other
- `:` - Enter command mode
- `Ctrl-c` - Toggle comment
- `_` - Trim whitespace from selection
- `Alt-o` / `Alt-ArrowUp` - Expand syntax selection
- `Alt-i` / `Alt-ArrowDown` - Shrink syntax selection
- `Alt-n` / `Alt-ArrowRight` - Go to next sibling in syntax tree
- `Alt-p` / `Alt-ArrowLeft` - Go to previous sibling in syntax tree

### Insert Mode
- `Escape` - Return to normal mode
- `Backspace` - Delete character before cursor
- `Delete` - Delete character after cursor
- `Enter` - Insert newline
- Arrow keys - Move cursor

## Implementation Notes

### Keybinding Conflicts

These additional keybindings are implemented with high precedence to work alongside the `codemirror-helix` extension. If you experience conflicts with other Obsidian plugins or keybindings, you can disable the additional keybindings in the plugin settings.

### Future Improvements

Some commands are currently simplified implementations:

1. **`s` (select_regex)**: Currently selects the word at cursor. A full implementation would open a prompt for regex input.
2. **`S` (split_selection)**: Currently splits on whitespace. A full implementation would allow regex-based splitting.
3. **`=` (format_selections)**: Placeholder implementation. Would require integration with a formatter or LSP.
4. **`G` (goto_line)**: Goes to last line. In Helix, it also accepts a count to go to a specific line number.

### LSP and Advanced Features

Some Helix keybindings related to LSP features (code actions, diagnostics, etc.) are not implemented as they would require LSP integration, which is beyond the scope of a simple keybinding plugin.

## Configuration

You can enable or disable the additional keybindings in the plugin settings:

1. Open Settings → Community plugins → Helix Keybindings
2. Toggle "Enable additional keybindings"
3. The editor will reload with the new settings

## Contributing

If you find issues or have suggestions for improving these keybindings, please open an issue or pull request on the GitHub repository.
