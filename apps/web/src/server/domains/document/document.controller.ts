import {
  CreateDocumentInput,
  IDocumentRepository,
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
}
