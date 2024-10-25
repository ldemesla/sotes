"use client";

import "~/styles/index.css";

import { Content, EditorContent, JSONContent } from "@tiptap/react";
import React, { useEffect, useState } from "react";

import { Document } from "~/server/domains/document/document.types";
import { listDocuments, updateGeneratedNote } from "~/server/domains/document/document.actions";
import { useBlockEditor } from "~/hooks/useBlockEditor";
import { DocumentCard } from "../document-card";

export const GeneratedNote = ({ aiToken, document }: { aiToken?: string; hasCollab?: boolean; document: Document }) => {
  const [sources, setSources] = useState<Document[]>([]);

  const { editor } = useBlockEditor({
    aiToken,
    document,
    update: updateGeneratedNote,
  });

  useEffect(() => {
    editor?.setEditable(false);

    if (editor) {
      if (!(document.content as JSONContent)?.content?.length && document.markdown) {
        editor.commands.insertContent(document.markdown);
      } else {
        editor.commands.setContent(document.content as Content);
      }
    }
  }, [document, editor]);

  useEffect(() => {
    if (document?.sources?.length) {
      listDocuments({
        filters: { ids: document.sources },
        pageSize: 5,
      }).then(sources => {
        setSources(sources?.documents ?? []);
      });
    }
  }, [document.sources]);

  useEffect(() => {
    const path = window.location.pathname;
    const pathSegments = path.split("/");
    const lastSegment = pathSegments[pathSegments.length - 1];

    if (lastSegment === "new") {
      window.history.replaceState(null, "", `/gen/${document.id}`);
    }
  }, [document.id]);

  if (!editor) {
    return null;
  }

  return (
    <div className="bg-card relative flex size-full flex-1 flex-col gap-12 overflow-hidden rounded-lg p-8 shadow-[0px_0px_3px_0px_rgba(0,0,0,0.25)]">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 overflow-y-auto">
        <p className="text-2xl font-bold text-black/80">{document.title}</p>
        <div>
          <>
            {sources.length > 0 && (
              <>
                <p className="text-md mb-2 font-semibold text-black/80">Sources</p>
                <div className="grid grid-cols-2 gap-4 xl:grid-cols-2 p-2">
                  {sources.map(document => (
                    <DocumentCard document={document} key={document.id} />
                  ))}
                </div>
              </>
            )}
          </>
        </div>
        <EditorContent editor={editor} className="w-full flex-1" />
      </div>
    </div>
  );
};

export default GeneratedNote;
