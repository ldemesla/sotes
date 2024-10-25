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
    const updatedDocument = await this.documentRepository.updateDocument(id, document);

    await mainQueue.add("processDocument", {
      content: updatedDocument.content as JSONContent,
      title: updatedDocument.title ?? "",
      id: updatedDocument.id,
      type: "PROCESS_DOCUMENT",
      markdown: updatedDocument.markdown ?? "",
    });

    return updatedDocument;
  }

  async updateGeneratedNote(id: string, document: UpdateDocumentInput) {
    return this.documentRepository.updateGeneratedNote(id, document);
  }

  async getGeneratedNote(id: string) {
    return this.documentRepository.getGeneratedNote(id);
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

  async createGeneratedNote(input: CreateDocumentInput) {
    return this.documentRepository.createGeneratedNote(input);
  }

  async listGeneratedNotes(input: ListDocumentsInput) {
    const generatedNotes = await this.documentRepository.listGeneratedNotes(input);
    let nextPageToken: string | undefined;
    if (generatedNotes.length === input.pageSize) {
      const lastGeneratedNote = generatedNotes[generatedNotes.length - 1];
      nextPageToken = `${lastGeneratedNote.created_at}_${lastGeneratedNote.id}`;
    }
    return { generatedNotes, nextPageToken };
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
      const chunks = results.map(result => result.payload?.chunk);

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
2. Wrap your analysis inside <analysis> tags:
   a. List all relevant quotes from the user's notes related to the topic.
   b. Identify key phrases or repeated ideas related to the topic.
   c. Categorize these quotes and key phrases into themes or subtopics.
   d. Consider the context and potential implications of the user's thoughts.
   e. Identify potential correlations and contradictions based on these categorized quotes and phrases.
   f. Note the chronological order of the information, if applicable.
   g. Identify any emotional undertones or personal opinions expressed in the notes.

3. Based on your analysis, prepare a response that includes:
   a. A concise summary of the user's thoughts on the topic.
   b. Any correlations between different ideas or concepts related to the topic.
   c. Any contradictions or inconsistencies in the user's thoughts on the topic.
   d. Potential implications or insights derived from the user's notes.
   e. Any observed changes in the user's thoughts or opinions over time, if applicable.
   f. The overall emotional tone or personal stance of the user regarding the topic.

4. If no relevant information is found, prepare a response informing the user that there isn't enough information in their notes to answer the question.

5. Generate a title for the document that reflects the main topic or insight.

6. Format your output as a JSON object with the following structure:

{
  "response": "Your well-written and clear response in HTML format",
  "title": "A title for the generated document"
}

Important: The "response" field should be formatted in HTML, suitable for use in a React-powered TipTap text editor. Use appropriate HTML tags to structure your response, such as <p> for paragraphs, <ul> and <li> for lists, and so on. For headings only use <h4>, <h5> and <h6> tags.


Example of the desired output structure (content is purely illustrative):

{
  "response": "<h1>[Main Topic]</h1><p>[Engaging introduction to the topic, incorporating key ideas from the notes]</p><h2>Key Insights</h2><p>[Detailed exploration of the main points, weaving together information from the notes in a coherent narrative]</p><h2>Connections and Patterns</h2><p>[Discussion of how different ideas relate to each other, highlighting any interesting correlations discovered in the notes]</p><h2>Evolving Perspectives</h2><p>[If applicable, a section discussing how thoughts or opinions on the topic have changed over time, as reflected in the notes]</p><h2>Implications and Future Considerations</h2><p>[Exploration of potential consequences or future directions related to the topic, based on the insights from the notes]</p><h2>Personal Reflections</h2><p>[A section that captures the emotional tone or personal stance on the topic, as expressed in the notes]</p>",
  "title": "[Main Topic]: Insights and Reflections"
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
        llmResponse.choices[0].message.content ?? "",
      );

      return {
        response: parsedAnswer.response,
        title: parsedAnswer.title,
        sources: results.map(res => res?.payload?.documentId) as string[],
      };
    } catch (e) {
      console.error(e);
    }
  }
}
