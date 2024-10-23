import type { JSONContent } from "@tiptap/core";
import { Selectable } from "kysely";
import { Document } from "~/server/db/database.types";

export interface IDocumentRepository {
  createDocument(document: CreateDocumentInput): Promise<Selectable<Document>>;
  getDocument(id: string): Promise<Document | undefined>;
  updateDocument(
    id: string,
    document: UpdateDocumentInput
  ): Promise<Document | undefined>;
  deleteDocument(id: string): Promise<void>;
}

export type DocumentInput = {
  title: string;
  content: JSONContent;
};

export type CreateDocumentInput = DocumentInput;

export type UpdateDocumentInput = DocumentInput;
