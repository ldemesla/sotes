"use server";

import { documentController } from ".";
import { CreateDocumentInput, UpdateDocumentInput } from "./document.types";

export const updateDocument = async (
  id: string,
  input: UpdateDocumentInput
) => {
  await documentController.updateDocument(id, input);
};

export const createDocument = async (input: CreateDocumentInput) => {
  return documentController.createDocument(input);
};
