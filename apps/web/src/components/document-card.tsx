"use client";

import { JSONContent, generateText } from "@tiptap/core";

import { Document } from "~/server/domains/document/document.types";
import ExtensionKit from "~/extensions/extension-kit";
import Link from "next/link";

export const DocumentCard = ({ document }: { document: Document }) => {
  return (
    <Link
      key={document.id}
      className="shadow-item hover:shadow-item-hover flex h-24 flex-col gap-1 rounded-xl bg-[#F7F7F7] p-4 transition-all duration-200 hover:bg-[#FAFAFA]"
      href={`/${document.id}`}
    >
      <div className="flex items-center">
        <h2 className="line-clamp-1 text-[13px] font-medium">
          {document.title}
        </h2>
        {document.created_at && (
          <span className="ml-auto whitespace-nowrap text-xs text-black/40">
            {new Date(document.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        )}
      </div>
      {document.content && (
        <p className="text-muted-foreground line-clamp-2 text-[13px]">
          {generateText(document.content as JSONContent, ExtensionKit())}
        </p>
      )}
    </Link>
  );
};
