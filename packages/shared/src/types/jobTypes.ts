import type { JSONContent } from "@tiptap/core";

interface BaseJob {
  type: "PROCESS_DOCUMENT";
}

export interface ProcessDocumentJob extends BaseJob {
  content: JSONContent;
  markdown: string;
  title: string;
  id: string;
  type: "PROCESS_DOCUMENT";
}

export type Job = ProcessDocumentJob;

export type TipTapDocument = JSONContent;
