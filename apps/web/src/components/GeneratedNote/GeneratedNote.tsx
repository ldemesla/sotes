"use client";

import "~/styles/index.css";

import { Content, EditorContent } from "@tiptap/react";
import React, { useCallback, useEffect, useState } from "react";

import { Document } from "~/server/domains/document/document.types";
import { cn } from "~/lib/utils";
import {
  listDocuments,
  queryDocuments,
  updateDocument,
} from "~/server/domains/document/document.actions";
import { useBlockEditor } from "~/hooks/useBlockEditor";
import { useSearchParams } from "next/navigation";
import { DocumentCard } from "../document-card";

export const GeneratedNote = ({
  aiToken,
  document,
}: {
  aiToken?: string;
  hasCollab?: boolean;
  document: Document;
}) => {
  const [title, setTitle] = useState(document.title ?? "New Note");
  const [sources, setSources] = useState<Document[]>([]);
  const searchParams = useSearchParams();

  const { editor } = useBlockEditor({
    aiToken,
    document,
  });

  useEffect(() => {
    editor?.setEditable(false);

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

  const query = searchParams.get("query") || "";

  useEffect(() => {
    if (query && editor) {
      const splitQuery = query.split("\n");
      const queryWithNewlines = splitQuery.map((line) => `\n${line}`).join("");
      queryDocuments(queryWithNewlines).then((res) => {
        editor?.commands.insertContent(res?.response ?? "");
        setTitle(res?.title ?? "");
        if (res?.sources) {
          listDocuments({
            filters: {
              ids: res.sources,
            },
            pageSize: 5,
          }).then((sources) => {
            setSources(sources?.documents ?? []);
          });
        }
      });
    }
  }, [query, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="bg-card relative flex size-full flex-1 flex-col gap-12 overflow-hidden rounded-lg p-8 shadow-[0px_0px_3px_0px_rgba(0,0,0,0.25)]">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 overflow-y-auto">
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
        <div>
          <p className="text-md mb-2 font-semibold">Sources</p>
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-2 p-2">
            {sources.map((document) => (
              <DocumentCard document={document} key={document.id} />
            ))}
          </div>
        </div>
        <EditorContent editor={editor} className="w-full flex-1" />
      </div>
    </div>
  );
};

export default GeneratedNote;
