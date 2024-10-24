"use client";

import "~/styles/index.css";

import { Content, EditorContent } from "@tiptap/react";
import React, { useCallback, useEffect } from "react";

import { Document } from "~/server/domains/document/document.types";
import { VoiceRecorder } from "../record-voice";
import { useBlockEditor } from "~/hooks/useBlockEditor";

export const BlockEditor = ({
  aiToken,
  document,
}: {
  aiToken?: string;
  hasCollab?: boolean;
  document: Document;
}) => {
  const { editor } = useBlockEditor({
    aiToken,
    document,
  });

  useEffect(() => {
    if (editor && document) {
      editor.commands.setContent(document.content as Content);
    }
  }, [document, editor]);

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
    <div className='bg-card relative flex size-full flex-1 flex-col gap-12 overflow-hidden rounded-lg p-4 shadow-[0px_0px_3px_0px_rgba(0,0,0,0.25)]'>
      <EditorContent
        editor={editor}
        className='w-full flex-1 overflow-y-auto'
      />

      <VoiceRecorder addTranscriptToEditor={addTranscriptToEditor} />
    </div>
  );
};

export default BlockEditor;
