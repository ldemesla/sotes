"use server";

import { documentController } from ".";
import { CreateDocumentInput, ListDocumentsInput, UpdateDocumentInput } from "./document.types";

export const updateDocument = async (id: string, input: UpdateDocumentInput) => {
  await documentController.updateDocument(id, input);
};

export const updateGeneratedNote = async (id: string, input: UpdateDocumentInput) => {
  await documentController.updateGeneratedNote(id, input);
};

export const createDocument = async (input: CreateDocumentInput) => {
  return documentController.createDocument(input);
};

export const createGeneratedNote = async (input: CreateDocumentInput) => {
  return documentController.createGeneratedNote(input);
};

export const queryDocuments = async (query: string) => {
  return documentController.queryDocuments({ query });
};

export const listDocuments = async (input: ListDocumentsInput) => {
  return documentController.listDocuments(input);
};

export const listGeneratedNotes = async (input: ListDocumentsInput) => {
  return documentController.listGeneratedNotes(input);
};
