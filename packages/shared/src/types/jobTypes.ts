import type { JSONContent } from "@tiptap/core";

export interface ProcessDocument {
  content: JSONContent;
  title: string;
  id: string;
}

export type Job = ProcessDocument;
