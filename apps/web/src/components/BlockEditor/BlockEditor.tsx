"use client";

import "~/styles/index.css";

import React, { useCallback, useRef } from "react";

import { EditorContent } from "@tiptap/react";
import { VoiceRecorder } from "../record-voice";
import { useBlockEditor } from "~/hooks/useBlockEditor";

export const BlockEditor = ({
  aiToken,
}: {
  aiToken?: string;
  hasCollab?: boolean;
}) => {
  const menuContainerRef = useRef(null);

  const { editor } = useBlockEditor({
    aiToken,
  });

  const addTranscriptToEditor = useCallback(
    (transcript: string) => {
      if (editor) {
        editor.commands.insertContent(transcript);
      }
    },
    [editor]
  );

  if (!editor) {
    return null;
  }

  return (
    <div className='flex flex-col gap-12 rounded bg-card px-4 py-4 relative flex-1 h-full overflow-hidden w-full'>
      <EditorContent
        editor={editor}
        className='flex-1 overflow-y-auto w-full'
      />

      <VoiceRecorder addTranscriptToEditor={addTranscriptToEditor} />
    </div>
  );
};

export default BlockEditor;
