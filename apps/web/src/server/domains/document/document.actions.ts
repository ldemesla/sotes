"use server";

import { documentController } from ".";
import { UpdateDocumentInput } from "./document.types";

export const updateDocument = async (
  id: string,
  input: UpdateDocumentInput
) => {
  await documentController.updateDocument(id, input);
};
