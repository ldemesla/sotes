"use client";

import "~/styles/index.css";

import { Content, EditorContent } from "@tiptap/react";
import React, { useCallback, useEffect, useState } from "react";

import { Document } from "~/server/domains/document/document.types";
import { VoiceRecorder } from "../record-voice";
import { cn } from "~/lib/utils";
import { updateDocument } from "~/server/domains/document/document.actions";
import { useBlockEditor } from "~/hooks/useBlockEditor";

const formatDate = (date: Date | null) => {
  if (!date) return "Today";

  const updatedAt = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (updatedAt.toDateString() === today.toDateString()) {
    return "Today";
  } else if (updatedAt.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return updatedAt.toLocaleString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
};

export const BlockEditor = ({
  aiToken,
  document,
}: {
  aiToken?: string;
  hasCollab?: boolean;
  document: Document;
}) => {
  const [title, setTitle] = useState(document.title);

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
    <div className='bg-card relative flex size-full flex-1 flex-col gap-12 overflow-hidden rounded-lg p-8 shadow-[0px_0px_3px_0px_rgba(0,0,0,0.25)]'>
      <div className='mx-auto flex w-full max-w-2xl flex-col gap-4 overflow-y-auto'>
        <p className='text-muted-foreground text-center'>
          {formatDate(document.updated_at)}
        </p>
        <input
          className={cn(
            "w-full border-none bg-transparent text-lg font-semibold focus:outline-none",
            {
              hidden: title === "Untitled",
            }
          )}
          value={title ?? ""}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          onBlur={(e) => {
            updateDocument(document.id, {
              title: e.target.value,
            });
          }}
        />
        <EditorContent editor={editor} className='w-full flex-1' />

        <VoiceRecorder
          addTranscriptToEditor={addTranscriptToEditor}
          previousTranscript={document.markdown}
          updateDocumentTitle={(title: string) => {
            if (title === "Untitled") {
              setTitle(title);
              updateDocument(document.id, {
                title,
              });
            }
          }}
        />
      </div>
    </div>
  );
};

export default BlockEditor;
