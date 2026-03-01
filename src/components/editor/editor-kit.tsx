'use client';

import { type Value } from 'platejs';
import { type TPlateEditor, useEditorRef } from 'platejs/react';

import { BasicBlocksKit } from './plugins/basic-blocks-kit';
import { BasicMarksKit } from './plugins/basic-marks-kit';
import { BlockPlaceholderKit } from './plugins/block-placeholder-kit';
import { FixedToolbarKit } from './plugins/fixed-toolbar-kit';
import { MarkdownKit } from './plugins/markdown-kit';

export const EditorKit = [
  // ...AIKit,
  // ...BlockMenuKit,

  // Elements
  ...BasicBlocksKit,
  // ...CodeBlockKit,
  // ...CodeDrawingKit,
  // ...TableKit,
  // ...ToggleKit,
  // ...TocKit,
  // ...MediaKit,
  // ...CalloutKit,
  // ...ColumnKit,
  // ...MathKit,
  // ...DateKit,
  // ...LinkKit,
  // ...MentionKit,

  // Marks
  ...BasicMarksKit,
  // ...FontKit,

  // Block Style
  // ...ListKit,
  // ...AlignKit,
  // ...LineHeightKit,

  // Collaboration
  // ...DiscussionKit,
  // ...CommentKit,
  // ...SuggestionKit,

  // Editing
  // ...SlashKit,
  // ...AutoformatKit,
  // ...CursorOverlayKit,
  // ...DndKit,
  // ...EmojiKit,
  // ...ExitBreakKit,
  // TrailingBlockPlugin,

  // Parsers
  // ...DocxKit,
  ...MarkdownKit,

  // UI
  ...BlockPlaceholderKit,
  ...FixedToolbarKit,
  // ...FloatingToolbarKit,
];

export type MyEditor = TPlateEditor<Value, (typeof EditorKit)[number]>;

export const useEditor = () => useEditorRef<MyEditor>();
