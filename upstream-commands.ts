/**
 * Additional Helix commands for codemirror-helix
 *
 * This file contains command implementations that match codemirror-helix's
 * internal architecture and can be integrated directly into their codebase.
 *
 * Integration instructions:
 * 1. Copy command definitions into src/lib.ts
 * 2. Merge into helixCommandBindings.normal and helixCommandBindings.insert
 * 3. Commands use existing helpers: cmdCount(), mapSel(), resetCount()
 * 4. Commands access MODE_EFF for mode transitions
 * 5. Checkpoint system integrated for undo/redo
 *
 * @see https://gitlab.com/_rvidal/codemirror-helix
 */

import { EditorView } from '@codemirror/view';
import { EditorSelection } from '@codemirror/state';
import {
  deleteToLineStart,
  deleteToLineEnd,
  deleteCharBackward,
  deleteCharForward
} from '@codemirror/commands';

// Internal types from codemirror-helix
// These exist in their codebase and don't need to be redefined
interface Mode {
  type: 0 | 1 | 4; // Normal | Insert | Select
  minor: number;
  count?: number;
  register?: string;
  expecting?: any;
}

// Internal helpers from codemirror-helix
// These functions already exist in their codebase
declare function cmdCount(mode: Mode): number;
declare function resetCount(mode: Mode): any;
declare function mapSel(selection: any, mapper: (range: any) => any): any;
declare const MODE_EFF: {
  NORMAL: any;
  SELECT: any;
  INSERT: any;
};

/**
 * Additional command bindings to merge into helixCommandBindings.normal
 * These follow the exact pattern used in codemirror-helix
 */
export const additionalNormalCommands = {
  // ==========================================================================
  // WORD MOVEMENT - LONG WORDS (whitespace-delimited)
  // ==========================================================================

  /**
   * W - Move to next WORD start (whitespace-delimited)
   * Similar to moveByGroup but uses whitespace-only boundaries
   */
  ["W"](view: EditorView, mode: Mode) {
    const normal = mode.type === 0; // Normal mode
    const count = cmdCount(mode);

    const tr = view.state.changeByRange((range) => {
      let pos = range.head;

      for (let i = 0; i < count; i++) {
        const line = view.state.doc.lineAt(pos);
        const text = view.state.doc.sliceString(pos, line.to);

        // Skip non-whitespace
        let j = 0;
        while (j < text.length && !/\s/.test(text[j])) j++;
        // Skip whitespace
        while (j < text.length && /\s/.test(text[j])) j++;

        if (j < text.length) {
          pos = pos + j;
        } else if (line.number < view.state.doc.lines) {
          // Move to start of next line
          const nextLine = view.state.doc.line(line.number + 1);
          pos = nextLine.from;
        } else {
          break; // At end of document
        }
      }

      const newRange = normal
        ? EditorSelection.cursor(pos)
        : EditorSelection.range(range.anchor, pos);

      return { range: newRange };
    });

    view.dispatch({
      ...tr,
      effects: resetCount(mode),
      scrollIntoView: true
    });
  },

  /**
   * B - Move to previous WORD start (whitespace-delimited)
   */
  ["B"](view: EditorView, mode: Mode) {
    const normal = mode.type === 0;
    const count = cmdCount(mode);

    const tr = view.state.changeByRange((range) => {
      let pos = range.head;

      for (let i = 0; i < count; i++) {
        if (pos === 0) break;

        const line = view.state.doc.lineAt(pos);
        const text = view.state.doc.sliceString(line.from, pos);

        // Move back one char
        let j = text.length - 1;
        // Skip whitespace
        while (j > 0 && /\s/.test(text[j])) j--;
        // Skip non-whitespace
        while (j > 0 && !/\s/.test(text[j])) j--;
        // Move forward to start of WORD
        if (j > 0 && /\s/.test(text[j])) j++;

        if (j < text.length - 1) {
          pos = line.from + j;
        } else if (line.number > 1) {
          // Move to previous line
          const prevLine = view.state.doc.line(line.number - 1);
          const prevText = view.state.doc.sliceString(prevLine.from, prevLine.to);

          let k = prevText.length - 1;
          while (k > 0 && /\s/.test(prevText[k])) k--;
          while (k > 0 && !/\s/.test(prevText[k])) k--;
          if (k > 0 && /\s/.test(prevText[k])) k++;

          pos = prevLine.from + k;
        } else {
          pos = 0;
          break;
        }
      }

      const newRange = normal
        ? EditorSelection.cursor(pos)
        : EditorSelection.range(range.anchor, pos);

      return { range: newRange };
    });

    view.dispatch({
      ...tr,
      effects: resetCount(mode),
      scrollIntoView: true
    });
  },

  /**
   * E - Move to next WORD end (whitespace-delimited)
   */
  ["E"](view: EditorView, mode: Mode) {
    const normal = mode.type === 0;
    const count = cmdCount(mode);

    const tr = view.state.changeByRange((range) => {
      let pos = range.head;

      for (let i = 0; i < count; i++) {
        const line = view.state.doc.lineAt(pos);
        const text = view.state.doc.sliceString(pos, line.to);

        let j = 0;
        // Skip whitespace if we're on it
        while (j < text.length && /\s/.test(text[j])) j++;
        // Move to end of WORD
        while (j < text.length && !/\s/.test(text[j])) j++;

        if (j > 0 && pos + j <= line.to) {
          pos = pos + j;
        } else if (line.number < view.state.doc.lines) {
          // Move to next non-empty line
          let currentLine = line.number;
          while (currentLine < view.state.doc.lines) {
            currentLine++;
            const nextLine = view.state.doc.line(currentLine);
            const nextText = view.state.doc.sliceString(nextLine.from, nextLine.to);

            if (nextText.trim().length === 0) continue;

            let k = 0;
            while (k < nextText.length && /\s/.test(nextText[k])) k++;
            while (k < nextText.length && !/\s/.test(nextText[k])) k++;

            if (k > 0) {
              pos = nextLine.from + k;
              break;
            }
          }
        }
      }

      const newRange = normal
        ? EditorSelection.cursor(pos)
        : EditorSelection.range(range.anchor, pos);

      return { range: newRange };
    });

    view.dispatch({
      ...tr,
      effects: resetCount(mode),
      scrollIntoView: true
    });
  },

  // ==========================================================================
  // SELECTION COMMANDS
  // ==========================================================================

  /**
   * S - Split selection on whitespace
   * Creates multiple selections by splitting on whitespace boundaries
   */
  ["S"](view: EditorView) {
    const ranges: any[] = [];

    for (const range of view.state.selection.ranges) {
      const text = view.state.sliceDoc(range.from, range.to);
      const parts = text.split(/\s+/);
      let searchFrom = 0;

      for (const part of parts) {
        if (part.length > 0) {
          const idx = text.indexOf(part, searchFrom);
          if (idx !== -1) {
            const actualPos = range.from + idx;
            ranges.push(
              EditorSelection.range(actualPos, actualPos + part.length)
            );
            searchFrom = idx + part.length;
          }
        }
      }
    }

    if (ranges.length > 0) {
      view.dispatch({
        selection: EditorSelection.create(ranges, 0),
        scrollIntoView: true
      });
    }
  },

  /**
   * X - Extend selection to line bounds
   * Uppercase version of 'x' - extends to full line including newline
   * Similar to 'x' but always extends to include the newline
   */
  ["X"](view: EditorView, mode: Mode) {
    view.dispatch({
      selection: mapSel(view.state.selection, (range) => {
        const startLine = view.state.doc.lineAt(range.from);
        const endLine = view.state.doc.lineAt(range.to);
        return EditorSelection.range(
          startLine.from,
          Math.min(
            view.state.doc.length,
            endLine.to + view.state.lineBreak.length
          )
        );
      }),
      effects: resetCount(mode),
      scrollIntoView: true
    });
  },

  // ==========================================================================
  // EDITING COMMANDS
  // ==========================================================================

  /**
   * C - Copy selection to next line
   * Duplicates selected lines below
   * Uses checkpoint for undo/redo tracking
   */
  ["C"]: {
    checkpoint: true,
    command(view: EditorView) {
      const { state } = view;
      const changes: any[] = [];
      const newRanges: any[] = [];
      let offset = 0;

      for (const range of state.selection.ranges) {
        const startLine = state.doc.lineAt(range.from);
        const endLine = state.doc.lineAt(range.to);
        const text = state.sliceDoc(startLine.from, endLine.to);

        changes.push({
          from: endLine.to,
          insert: state.lineBreak + text
        });

        const newStart = endLine.to + offset + state.lineBreak.length;
        newRanges.push(
          EditorSelection.range(newStart, newStart + text.length)
        );
        offset += state.lineBreak.length + text.length;
      }

      if (changes.length > 0) {
        view.dispatch({
          changes,
          selection: EditorSelection.create(
            newRanges,
            newRanges.length - 1
          ),
          scrollIntoView: true
        });
      }
    }
  },

  /**
   * G - Go to last line
   * Shortcut for 'ge' (goto end), or go to specific line with count
   */
  ["G"](view: EditorView, mode: Mode) {
    const isNormal = mode.type === 0;
    const targetLineNum = mode.count ?? view.state.doc.lines;
    const lineNum = Math.min(targetLineNum, view.state.doc.lines);
    const line = view.state.doc.line(lineNum);

    const selection = isNormal
      ? EditorSelection.cursor(line.from)
      : EditorSelection.range(
          view.state.selection.main.from,
          line.from
        );

    view.dispatch({
      selection,
      effects: [
        isNormal ? MODE_EFF.NORMAL : MODE_EFF.SELECT,
        resetCount(mode)
      ],
      scrollIntoView: true
    });
  }
};

/**
 * Additional insert mode commands
 * These are executed only in insert mode
 *
 * Note: Insert mode commands don't receive the 'mode' parameter in the
 * current codemirror-helix architecture. They take only (view) or (view, mode)
 * where mode is optional for insert-only commands.
 */
export const additionalInsertCommands = {
  /**
   * Ctrl-w - Delete word backward
   * Deletes from cursor to start of previous word
   */
  ["Ctrl-w"](view: EditorView) {
    const { state } = view;
    const changes: any[] = [];

    for (const range of state.selection.ranges) {
      const line = state.doc.lineAt(range.from);
      const lineText = state.doc.sliceString(line.from, range.from);

      // Find start of previous word
      let i = lineText.length - 1;
      while (i >= 0 && /\s/.test(lineText[i])) i--;
      while (i >= 0 && /\S/.test(lineText[i])) i--;

      const deleteFrom = line.from + i + 1;
      if (deleteFrom < range.from) {
        changes.push({ from: deleteFrom, to: range.from });
      }
    }

    if (changes.length > 0) {
      view.dispatch({ changes });
    }
  },

  /**
   * Alt-d - Delete word forward
   * Deletes from cursor to end of next word
   */
  ["Alt-d"](view: EditorView) {
    const { state } = view;
    const changes: any[] = [];

    for (const range of state.selection.ranges) {
      const line = state.doc.lineAt(range.from);
      const lineText = state.doc.sliceString(range.from, line.to);

      // Find end of next word
      let i = 0;
      while (i < lineText.length && /\s/.test(lineText[i])) i++;
      while (i < lineText.length && /\S/.test(lineText[i])) i++;

      const deleteTo = range.from + i;
      if (deleteTo > range.from) {
        changes.push({ from: range.from, to: deleteTo });
      }
    }

    if (changes.length > 0) {
      view.dispatch({ changes });
    }
  },

  /**
   * Ctrl-u - Delete to line start
   * Uses CodeMirror's built-in command
   */
  ["Ctrl-u"]: deleteToLineStart,

  /**
   * Ctrl-k - Delete to line end
   * Uses CodeMirror's built-in command
   */
  ["Ctrl-k"]: deleteToLineEnd,

  /**
   * Ctrl-h - Delete char backward (same as Backspace)
   * Uses CodeMirror's built-in command
   */
  ["Ctrl-h"]: deleteCharBackward,

  /**
   * Ctrl-d - Delete char forward (same as Delete)
   * Uses CodeMirror's built-in command
   */
  ["Ctrl-d"]: deleteCharForward
};
