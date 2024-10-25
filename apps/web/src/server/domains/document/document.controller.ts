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
      const queryToEmbedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: input.query,
      });

      const embedding = queryToEmbedding.data[0].embedding;

      // Query the vector database with the embedding
      const results = await qdrant.search("documents", {
        vector: embedding,
        limit: 5,
        score_threshold: 0.3,
      });

      // Extract the chunks from the results
      const chunks = results.map((result) => result.payload?.chunk);

      // Query the LLM with the user query and the chunks
      const llmResponse = await openai.chat.completions.create({
        response_format: { type: "json_object" },
        model: "gpt-4o-2024-08-06",
        messages: [
          {
            role: "system",
            content: `
            You are an advanced AI summarization agent designed to analyze personal notes and provide insights on specific topics. Your task is to examine the provided notes carefully, extract relevant information, and present a comprehensive summary of the user's thoughts on the requested topic.

            Here are the user's notes that you will analyze:

            <user_notes>
            {{NOTES}}
            </user_notes>

            When the user asks a question about a specific topic, follow these steps:

            1. Analyze the notes thoroughly for any information related to the user's question.
            2. Wrap your analysis in <thought_process> tags:
              a. List all relevant quotes from the user's notes related to the topic.
              b. Identify key phrases or repeated ideas related to the topic.
              c. Categorize these quotes and key phrases into themes or subtopics.
              d. Consider the context and potential implications of the user's thoughts.
              e. Identify potential correlations and contradictions based on these categorized quotes and phrases.
            3. Based on your analysis, prepare a response that includes:
              a. A concise summary of the user's thoughts on the topic.
              b. Any correlations between different ideas or concepts related to the topic.
              c. Any contradictions or inconsistencies in the user's thoughts on the topic.
              d. Potential implications or insights derived from the user's notes.
            4. If no relevant information is found, prepare a response informing the user that there isn't enough information in their notes to answer the question.
            5. Generate a title for the document that reflects the main topic or insight.
            6. Format your output as a JSON object with the following structure:

            {
              "response": "Your well-written and clear response containing the summary, contradictions, correlations, implications, etc.",
              "title": "A title for the generated document"
            }

            Example of the desired output structure (content is purely illustrative):

            {
              "response": "Based on the analysis of your notes, it appears that [summary of thoughts]. Interestingly, there seems to be a correlation between [idea A] and [idea B]. However, there's a contradiction in your notes regarding [topic C], where you state [contradictory statement 1] but later mention [contradictory statement 2]. The implications of these thoughts suggest [potential insight or conclusion].",
              "title": "Analysis of [Main Topic] from Personal Notes"
            }

            Remember, the content of your response should be based solely on the information found in the user's notes. If there isn't enough information to answer the question, your response should reflect that.

            Now, please analyze the user's notes and answer their question.
            `,
          },
          { role: "system", content: chunks.join("\n") },
          { role: "user", content: input.query },
        ],
      });

      const parsedAnswer: { response: string; title: string } = JSON.parse(
        llmResponse.choices[0].message.content ?? ""
      );

      return {
        response: parsedAnswer.response,
        title: parsedAnswer.title,
        sources: results.map((res) => res?.payload?.documentId) as string[],
      };
    } catch (e) {
      console.error(e);
    }
  }
}
