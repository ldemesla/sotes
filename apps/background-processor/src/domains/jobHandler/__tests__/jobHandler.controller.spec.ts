import { describe, it } from "vitest";
import { jobHandlerController } from "..";
import { ProcessDocumentJob } from "shared";
import { v4 as uuid } from "uuid";

// local dev only for now
describe.skip("JobHandlerController", () => {
  describe("HandleProcessDocument", () => {
    it("should split the document and create embeddings", async () => {
      // Arrange
      const job: ProcessDocumentJob = {
        type: "PROCESS_DOCUMENT",
        content: [],
        markdown: "test",
        title: "test",
        // uuid
        id: uuid(),
      };

      // Act
      await jobHandlerController.handleProcessDocument(job);
    });
  });
});
