forked from [Sinono3/obsidian-helix](https://github.com/Sinono3/obsidian-helix)

> [!CAUTION]
> **Just transfered** This is a fork/transfer from [Sinono3/obsidian-helix](https://github.com/Sinono3/obsidian-helix)
and still very early stages.

# Obsidian Helix Keybindings

This plugin enables [Helix](https://helix-editor.com/) keybindings in [Obsidian.md](https://obsidian.md/) using the [Helix CodeMirror6 extension by jrvidal](https://gitlab.com/_rvidal/codemirror-helix).

This plugin extends the core `codemirror-helix` extension with additional keybindings that were missing from the original implementation, providing a more complete Helix editing experience. See [KEYBINDINGS.md](KEYBINDINGS.md) for a full list of available keybindings.

Keep in mind the CM6 extension is in a very early stage of development.

## Installation

Because this plugin isn't oficially in the Obsidian plugin list (yet), you must install it directly from the repo.
Two ways to do this are using BRAT or manually.

### Via BRAT

1. [Install BRAT](https://obsidian.md/plugins?search=brat)
2. Copy the link to this Git repository
3. Follow [these instructions](https://tfthacker.com/brat-quick-guide#Adding+a+beta+plugin)

### Manually

1. Clone the repository into `<your vault directory>/.obsidian/plugins` and then run:
  ```
  $ npm i
  $ npm run build
  ```
2. Go to Settings in Obsidian and enable `Helix Keybindings`.

## Usage

1) Make sure Vim keybindings are disabled in `Options->Editor->Advanced`.
2) Enable Helix keybindings in the plugin settings or toggle them via the command.

## Features

### Additional Keybindings

This plugin now includes additional Helix keybindings that supplement the core `codemirror-helix` extension:

- **Word movement**: `e`, `W`, `B`, `E` for more precise word navigation
- **Selection commands**: `s`, `S`, `Alt-s`, `X` for advanced text selection
- **Editing commands**: `C` (copy line), `G` (goto line)
- **Insert mode enhancements**: `Ctrl-w`, `Alt-d`, `Ctrl-u`, `Ctrl-k`, `Ctrl-h`, `Ctrl-d` for faster editing

You can enable or disable these additional keybindings in the plugin settings. See [KEYBINDINGS.md](KEYBINDINGS.md) for a complete reference.

### Customize cursor color

By default, the cursor color is the accent color. You can set it to another color by creating a custom CSS snippet for your vault, such as this:

```css
.cm-hx-block-cursor .cm-hx-cursor {
  background: red !important;
}
```
