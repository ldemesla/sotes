import { JSONContent } from "@tiptap/core";
import {
  CreateDocumentInput,
  IDocumentRepository,
  ListDocumentsInput,
  UpdateDocumentInput,
} from "./document.types";
import { mainQueue } from "~/server/queues";

export class DocumentController {
  constructor(private readonly documentRepository: IDocumentRepository) {}

  async createDocument(document: CreateDocumentInput) {
    return this.documentRepository.createDocument(document);
  }

  async getDocument(id: string) {
    return this.documentRepository.getDocument(id);
  }

  async updateDocument(id: string, document: UpdateDocumentInput) {
    const updatedDocument = await this.documentRepository.updateDocument(
      id,
      document
    );

    await mainQueue.add("processDocument", {
      content: updatedDocument.content as JSONContent,
      title: updatedDocument.title ?? "",
      id: updatedDocument.id,
      type: "PROCESS_DOCUMENT",
      markdown: updatedDocument.markdown ?? "",
    });

    return updatedDocument;
  }

  async deleteDocument(id: string) {
    return this.documentRepository.deleteDocument(id);
  }

  async listDocuments(input: ListDocumentsInput) {
    const documents = await this.documentRepository.listDocuments(input);
    let nextPageToken: string | undefined;
    if (documents.length === input.pageSize) {
      const lastDocument = documents[documents.length - 1];
      nextPageToken = `${lastDocument.created_at}_${lastDocument.id}`;
    }
    return { documents, nextPageToken };
  }
}
