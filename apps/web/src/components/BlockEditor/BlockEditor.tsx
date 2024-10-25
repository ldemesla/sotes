"use client";

import "~/styles/index.css";

import { Content, EditorContent, JSONContent } from "@tiptap/react";
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

export const BlockEditor = ({ aiToken, document }: { aiToken?: string; hasCollab?: boolean; document: Document }) => {
  const [title, setTitle] = useState(document.title);

  const { editor } = useBlockEditor({
    aiToken,
    document,
    update: updateDocument,
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
    [editor],
  );

  const improveTranscript = useCallback(() => {
    const improveTranscript = async (content: string) => {
      const response = await fetch("/api/improve-transcript", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
        }),
      });

      if (!response.ok) {
        throw new Error("No AI token provided, please set TIPTAP_AI_SECRET in your environment");
      }
      const { jsonContent: improvedTranscript, documentHeadline } = (await response.json()) as {
        jsonContent: JSONContent;
        documentHeadline: string;
      };
      console.log(documentHeadline);

      setTitle(documentHeadline);

      editor?.commands.setContent(improvedTranscript);
    };

    if (editor) {
      const editorContent = editor.getText();

      if (editorContent.length > 100) improveTranscript(editorContent);
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="bg-card relative size-full flex-1 overflow-hidden rounded-lg shadow-[0px_0px_3px_0px_rgba(0,0,0,0.25)]">
      <div className="bg-card flex flex-col gap-12 overflow-y-auto rounded-lg p-8">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-2">
          <p className="text-muted-foreground mb-4 text-center text-sm">{formatDate(document.updated_at)}</p>
          <textarea
            className={cn(
              "w-full border-none text-black/90 bg-transparent text-2xl font-semibold focus:outline-none resize-none",
              {
                hidden: title === "Untitled",
              },
            )}
            value={title ?? ""}
            onChange={e => {
              setTitle(e.target.value);
            }}
            onBlur={e => {
              updateDocument(document.id, {
                title: e.target.value,
              });
            }}
          />
          <EditorContent editor={editor} className="w-full flex-1" />
        </div>
      </div>
      <VoiceRecorder
        addTranscriptToEditor={addTranscriptToEditor}
        improveTranscript={improveTranscript}
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
  );
};

export default BlockEditor;
