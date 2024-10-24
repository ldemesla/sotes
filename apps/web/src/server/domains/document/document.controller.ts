import { JSONContent } from "@tiptap/core";
import {
  CreateDocumentInput,
  IDocumentRepository,
  ListDocumentsInput,
  QueryDocumentsInput,
  UpdateDocumentInput,
} from "./document.types";
import { mainQueue } from "~/server/queues";
import { qdrant } from "~/server/providers/qdrant";
import { openai } from "~/server/providers/openai";

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

  async queryDocuments(input: QueryDocumentsInput) {
    try {
      // Turn the query into an embedding
      console.log(input.query);
      const queryToEmbedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: input.query,
      });

      const embedding = queryToEmbedding.data[0].embedding;

      // Query the vector database with the embedding
      const results = await qdrant.search("documents", {
        vector: embedding,
        limit: 5,
        score_threshold: 0.7,
      });

      // Extract the chunks from the results
      const chunks = results.map((result) => result.payload?.chunk);

      console.log(chunks);

      // Query the LLM with the user query and the chunks
      const llmResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: input.query },
          { role: "assistant", content: chunks.join("\n") },
        ],
      });
      return llmResponse.choices[0].message.content;
    } catch (e) {
      console.error(e);
    }
  }
}
