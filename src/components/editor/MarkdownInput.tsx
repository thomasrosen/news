'use client'

import { cn } from '@/lib/utils';
import { MarkdownPlugin, remarkMdx, remarkMention } from '@platejs/markdown';
import { KEYS } from 'platejs';
import { Plate, usePlateEditor } from 'platejs/react';
import { useEffect, useRef } from 'react';
import remarkGfm from 'remark-gfm';
import { EditorKit } from './editor-kit';
import { Editor, EditorContainer } from './PlatejsEditor';

export const MarkdownKit = [
  MarkdownPlugin.configure({
    options: {
      plainMarks: [KEYS.suggestion, KEYS.comment],
      remarkPlugins: [remarkGfm, remarkMdx, remarkMention],
    },
  }),
];

function MarkdownInput({
  defaultValue = '',
  className,
  onChange,
  onBlur,
  placeholder = '',
}: any) {
  const editor = usePlateEditor({
    plugins: EditorKit,
    shouldInitialize: false,
  });

  const initializedRef = useRef(false)
  useEffect(() => {
    if (initializedRef.current === false && defaultValue) {
      initializedRef.current = true
      editor.tf.init({
        autoSelect: 'end',
        // Use deserialize in the value factory for initial content
        value: (editor: any) =>
          editor.getApi(MarkdownPlugin).markdown.deserialize(defaultValue, {
            remarkPlugins: [
              remarkGfm,
              remarkMdx,
            ],
          }),
      })
    }
  }, [editor, defaultValue]);

  return (
    <Plate
      onValueChange={() => {
        if (typeof onChange === 'function') {
          const markdownOutput = editor.api.markdown.serialize();
          onChange(markdownOutput)
        }
      }}
      editor={editor}
    >
      <EditorContainer>
        <Editor onBlur={onBlur} placeholder={placeholder} variant="none" className={cn('size-full pl-4 pb-72', className)} />
      </EditorContainer>
    </Plate>
  );
}

export default MarkdownInput
