import { db } from "~/server/providers/db";
import type {
  CreateDocumentInput,
  IDocumentRepository,
  UpdateDocumentInput,
} from "./document.types";
import { Document } from "~/server/db/database.types";
import { Selectable } from "kysely";

export class DocumentRepository implements IDocumentRepository {
  async createDocument(document: CreateDocumentInput) {
    return db
      .insertInto("document")
      .values({
        title: document.title,
        content: JSON.stringify(document.content),
      })
      .returningAll()
      .executeTakeFirst() as Promise<Selectable<Document>>;
  }

  async getDocument(id: string) {
    return db
      .selectFrom("document")
      .where("id", "=", id)
      .selectAll()
      .executeTakeFirst() as Promise<Document | undefined>;
  }

  async updateDocument(id: string, document: UpdateDocumentInput) {
    return db
      .updateTable("document")
      .set({
        title: document.title,
        content: JSON.stringify(document.content),
      })
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst() as Promise<Document | undefined>;
  }

  async deleteDocument(id: string) {
    await db.deleteFrom("document").where("id", "=", id).execute();
  }
}
