import type { JSONContent } from "@tiptap/core";
import { Selectable } from "kysely";
import { Document as DocumentDB } from "~/server/db/database.types";

export interface IDocumentRepository {
  createDocument(document: CreateDocumentInput): Promise<Document>;
  getDocument(id: string): Promise<Document | undefined>;
  updateDocument(id: string, document: UpdateDocumentInput): Promise<Document>;
  deleteDocument(id: string): Promise<void>;
  listDocuments(input: ListDocumentsInput): Promise<Document[]>;
}
export type Document = Selectable<DocumentDB>;

export type DocumentInput = {
  title: string;
  content: JSONContent;
};

export type CreateDocumentInput = DocumentInput;

export type UpdateDocumentInput = DocumentInput;

export type ListDocumentsInput = {
  pageSize: number;
  nextPageToken?: string;
};
