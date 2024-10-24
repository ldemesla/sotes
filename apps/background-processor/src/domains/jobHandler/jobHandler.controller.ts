import { Job, ProcessDocumentJob } from "shared";
import { MarkdownTextSplitter } from "@langchain/textsplitters";
import { openai } from "~/providers/openai";
import { qdrant } from "~/providers/qdrant";
import { v4 as uuid } from "uuid";

const splitter = new MarkdownTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

export class JobHandlerController {
  async processJob(job: Job) {
    switch (job.type) {
      case "PROCESS_DOCUMENT":
        return this.handleProcessDocument(job as ProcessDocumentJob);
    }

    return;
  }

  async handleProcessDocument(job: ProcessDocumentJob) {
    // Chunk the document
    const chunks = await splitter.splitText(job.markdown);

    console.log(chunks);

    // Create embeddings for each chunk
    const embeddings = await Promise.all(
      chunks.map(async (chunk) => {
        const response = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: chunk,
        });
        return response.data[0].embedding;
      })
    );

    console.log(embeddings);

    // Delete previous points for this document
    await qdrant.delete("documents", {
      filter: {
        should: {
          key: "documentId",
          match: {
            value: job.id,
          },
        },
      },
    });

    // Upsert the new points
    await qdrant.upsert("documents", {
      points: embeddings.map((embedding, index) => ({
        id: uuid(),
        vector: embedding,
        payload: {
          documentId: job.id,
          chunk: chunks[index],
        },
      })),
    });

    console.log("done");
  }
}
