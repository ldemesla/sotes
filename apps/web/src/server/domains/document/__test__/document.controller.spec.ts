import { describe, it, expect } from "vitest";
import { documentController } from "..";
import dayjs from "dayjs";
import { db } from "~/server/providers/db";

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
        markdown: "",
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
        markdown: "",
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
        markdown: "",
      });

      // Act
      const updatedDocument = await documentController.updateDocument(
        document.id,
        {
          title: updatedTitle,
          content: updatedContent,
          markdown: "",
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
        markdown: "",
      });

      // Act
      await documentController.deleteDocument(document.id);

      // Assert
      const documentDB = await documentController.getDocument(document.id);
      expect(documentDB).toBeUndefined();
    });
  });

  describe("ListDocuments", () => {
    it("should list documents in the correct order", async () => {
      //Arrange
      await db.deleteFrom("document").execute();

      for (let i = 0; i < 10; i++) {
        await db
          .insertInto("document")
          .values({
            title: `Test Document ${i}`,
            content: JSON.stringify(content),
            created_at: dayjs().subtract(i, "day").toDate(),
          })
          .execute();
      }

      /* -------------------------------------------------------------------------- */
      /*                                 FIRST PAGE                                 */
      /* -------------------------------------------------------------------------- */

      // Act
      const firstPage = await documentController.listDocuments({
        pageSize: 5,
      });

      // Assert
      expect(firstPage.documents.length).toBe(5);
      expect(firstPage.nextPageToken).toBeDefined();
      for (const [index, document] of firstPage.documents.entries()) {
        expect(document.title).toBe(`Test Document ${index}`);
      }

      /* -------------------------------------------------------------------------- */
      /*                                 SECOND PAGE                                */
      /* -------------------------------------------------------------------------- */

      const secondPage = await documentController.listDocuments({
        pageSize: 3,
        nextPageToken: firstPage.nextPageToken,
      });

      expect(secondPage.documents.length).toBe(3);
      expect(secondPage.nextPageToken).toBeDefined();
      for (const [index, document] of secondPage.documents.entries()) {
        expect(document.title).toBe(`Test Document ${index + 5}`);
      }

      /* -------------------------------------------------------------------------- */
      /*                                 THIRD PAGE                                */
      /* -------------------------------------------------------------------------- */
      const thirdPage = await documentController.listDocuments({
        pageSize: 3,
        nextPageToken: secondPage.nextPageToken,
      });

      expect(thirdPage.documents.length).toBe(2);
      expect(thirdPage.nextPageToken).toBeUndefined();
      for (const [index, document] of thirdPage.documents.entries()) {
        expect(document.title).toBe(`Test Document ${index + 8}`);
      }
    });
    it("should list documents with the same created_at in the correct order", async () => {
      //Arrange
      await db.deleteFrom("document").execute();

      const createdAt = dayjs().subtract(1, "day").toDate();

      for (let i = 0; i < 9; i++) {
        await db
          .insertInto("document")
          .values({
            title: `Test Document ${i}`,
            content: JSON.stringify(content),
            created_at: createdAt,
          })
          .execute();
      }

      // Act
      const firstPage = await documentController.listDocuments({
        pageSize: 10,
      });

      // Assert
      expect(firstPage.documents.length).toBe(9);
      expect(firstPage.nextPageToken).toBeUndefined();
      // Check that the id of each record is above the one of the next record
      for (let i = 0; i < firstPage.documents.length - 1; i++) {
        expect(firstPage.documents[i].id > firstPage.documents[i + 1].id).toBe(
          true
        );
      }
    });
  });

  describe.skip("QueryDocuments", () => {
    it("should query documents", async () => {
      // Act
      const response = await documentController.queryDocuments({
        query: "Who's my best friend",
      });

      console.log(response);

      // Assert
      expect(response).toBeDefined();
    });
  });
});
