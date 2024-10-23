import dayjs from "dayjs";
import {
  CreateDocumentInput,
  IDocumentRepository,
  ListDocumentsInput,
  UpdateDocumentInput,
} from "./document.types";

export class DocumentController {
  constructor(private readonly documentRepository: IDocumentRepository) {}

  async createDocument(document: CreateDocumentInput) {
    return this.documentRepository.createDocument(document);
  }

  async getDocument(id: string) {
    return this.documentRepository.getDocument(id);
  }

  async updateDocument(id: string, document: UpdateDocumentInput) {
    return this.documentRepository.updateDocument(id, document);
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
