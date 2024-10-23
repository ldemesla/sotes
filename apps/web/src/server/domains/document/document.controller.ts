import { DocumentRepository } from "./document.interface";

export class DocumentController {
  constructor(private readonly documentRepository: DocumentRepository) {}

  async createDocument(document: Document) {
    return this.documentRepository.createDocument(document);
  }

  async getDocument(id: string) {
    return this.documentRepository.getDocument(id);
  }

  async updateDocument(id: string, document: Document) {
    return this.documentRepository.updateDocument(id, document);
  }

  async deleteDocument(id: string) {
    return this.documentRepository.deleteDocument(id);
  }
}
