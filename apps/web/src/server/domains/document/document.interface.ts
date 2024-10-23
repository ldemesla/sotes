export interface DocumentRepository {
  createDocument(document: Document): Promise<Document>;
  getDocument(id: string): Promise<Document | null>;
  updateDocument(id: string, document: Document): Promise<Document | null>;
  deleteDocument(id: string): Promise<boolean>;
}
