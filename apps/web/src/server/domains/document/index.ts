import { DocumentController } from "./document.controller";
import { DocumentRepository } from "./document.repository";

export const documentController = new DocumentController(
  new DocumentRepository()
);
