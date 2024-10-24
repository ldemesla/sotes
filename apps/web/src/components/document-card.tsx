"use client";

import { JSONContent, generateText } from "@tiptap/core";

import { Document } from "~/server/domains/document/document.types";
import ExtensionKit from "~/extensions/extension-kit";
import Link from "next/link";

export const DocumentCard = ({ document }: { document: Document }) => {
  return (
    <Link
      key={document.id}
      className='flex gap-3 rounded-lg bg-white p-4 shadow-sm'
      href={`/${document.id}`}
    >
      <div>
        <h2 className='text-sm font-medium'>{document.title}</h2>
        {/* // TODO: can remove if we clear the db */}
        {document.content && document.content?.length !== 0 && (
          <p className='text-xs text-muted-foreground line-clamp-2'>
            {generateText(document.content as JSONContent, ExtensionKit())}
          </p>
        )}
      </div>
      {document.created_at && (
        <span className='ml-auto text-xs text-muted-foreground whitespace-nowrap'>
          {new Date(document.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>
      )}
    </Link>
  );
};
