import { Document as DocumentDB } from "shared";
import type { JSONContent } from "@tiptap/core";
import { Selectable } from "kysely";

export interface IDocumentRepository {
  createDocument(document: CreateDocumentInput): Promise<Document>;
  getDocument(id: string): Promise<Document | undefined>;
  updateDocument(id: string, document: UpdateDocumentInput): Promise<Document>;
  deleteDocument(id: string): Promise<void>;
  listDocuments(input: ListDocumentsInput): Promise<Document[]>;
  listGeneratedNotes(input: ListDocumentsInput): Promise<Document[]>;
  createGeneratedNote(note: CreateDocumentInput): Promise<Document>;
  updateGeneratedNote(id: string, document: UpdateDocumentInput): Promise<Document>;
  getGeneratedNote(id: string): Promise<Document | undefined>;
}
export type Document = Selectable<DocumentDB>;

export type DocumentInput = {
  title: string;
  content: JSONContent;
  markdown: string;
  sources?: string[];
};

export type CreateDocumentInput = DocumentInput;

export type UpdateDocumentInput = Partial<DocumentInput>;

export type ListDocumentsInput = {
  pageSize: number;
  filters?: {
    ids?: string[];
  };
  nextPageToken?: string;
};

export type QueryDocumentsInput = {
  query: string;
};
