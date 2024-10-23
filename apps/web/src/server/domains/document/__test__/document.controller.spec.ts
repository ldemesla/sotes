import { describe, it, expect } from "vitest";
import { documentController } from "..";

describe("DocumentController", () => {
  const title = "Test Document";
  const content = [
    {
      type: "paragraph",
      content: [{ text: "Hello, world!" }],
    },
  ];

  describe("CreateDocument", () => {
    it("should create a document", async () => {
      //Arrange

      // Act
      const document = await documentController.createDocument({
        title,
        content,
      });

      // Assert
      const documentDB = await documentController.getDocument(document.id);
      expect(documentDB).toBeDefined();
      expect(documentDB?.title).toBe(title);
      expect(documentDB?.content).toEqual(content);
    });
  });

  describe("GetDocument", () => {
    it("should get a document", async () => {
      //Arrange
      const document = await documentController.createDocument({
        title,
        content,
      });

      // Act
      const documentDB = await documentController.getDocument(document.id);

      // Assert
      expect(documentDB).toBeDefined();
      expect(documentDB?.title).toBe(title);
      expect(documentDB?.content).toEqual(content);
    });
  });

  describe("UpdateDocument", () => {
    it("should update a document", async () => {
      //Arrange
      const updatedTitle = "Updated Document";
      const updatedContent = [
        {
          type: "paragraph",
          content: [{ text: "Updated content" }],
        },
      ];

      const document = await documentController.createDocument({
        title,
        content,
      });

      // Act
      const updatedDocument = await documentController.updateDocument(
        document.id,
        {
          title: updatedTitle,
          content: updatedContent,
        }
      );

      // Assert
      expect(updatedDocument).toBeDefined();
      expect(updatedDocument?.title).toBe(updatedTitle);
      expect(updatedDocument?.content).toEqual(updatedContent);
    });
  });

  describe("DeleteDocument", () => {
    it("should delete a document", async () => {
      //Arrange
      const document = await documentController.createDocument({
        title,
        content,
      });

      // Act
      await documentController.deleteDocument(document.id);

      // Assert
      const documentDB = await documentController.getDocument(document.id);
      expect(documentDB).toBeUndefined();
    });
  });
});
