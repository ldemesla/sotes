"use client";

import "~/styles/index.css";

import { Content, EditorContent, JSONContent } from "@tiptap/react";
import React, { useEffect, useState } from "react";
import { listDocuments, updateGeneratedNote } from "~/server/domains/document/document.actions";

import { Document } from "~/server/domains/document/document.types";
import { DocumentCard } from "../document-card";
import { useBlockEditor } from "~/hooks/useBlockEditor";

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
      const newUrl = `/gen/${document.id}`;
      window.history.pushState({ path: newUrl }, "", newUrl);
    }
  }, [document.id]);

  if (!editor) {
    return null;
  }

  return (
    <div className="bg-card shadow-section flex size-full flex-1 overflow-hidden overflow-y-auto rounded-lg p-8 pt-16">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-12">
        <p className="text-2xl font-bold text-black/80">{document.title}</p>

        {sources.length > 0 && (
          <div>
            <p className="text-md mb-2 font-semibold text-black/80">Sources</p>
            <div className="grid grid-cols-2 gap-4 p-2 xl:grid-cols-2">
              {sources.map(document => (
                <DocumentCard document={document} key={document.id} />
              ))}
            </div>
          </div>
        )}

        <EditorContent editor={editor} className="w-full flex-1 pb-32" />
      </div>
    </div>
  );
};

export default GeneratedNote;
