import { db } from "~/server/providers/db";
import type {
  CreateDocumentInput,
  IDocumentRepository,
  ListDocumentsInput,
  Document,
  UpdateDocumentInput,
} from "./document.types";
import dayjs from "dayjs";
import { sql } from "kysely";

export class DocumentRepository implements IDocumentRepository {
  async createDocument(document: CreateDocumentInput) {
    return db
      .insertInto("document")
      .values({
        title: document.title,
        content: JSON.stringify(document.content),
      })
      .returningAll()
      .executeTakeFirst() as Promise<Document>;
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
        markdown: document.markdown,
      })
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst() as Promise<Document>;
  }

  async deleteDocument(id: string) {
    await db.deleteFrom("document").where("id", "=", id).execute();
  }

  async listDocuments(input: ListDocumentsInput) {
    let builder = db
      .selectFrom("document")
      .orderBy(["created_at desc", "id desc"])
      .limit(input.pageSize)
      .selectAll();

    if (input.filters?.ids) {
      builder = builder.where("id", "in", input.filters.ids);
    }

    if (input.nextPageToken) {
      const cursorDate = input.nextPageToken?.split("_")[0];
      const cursorId = input.nextPageToken?.split("_")[1];
      builder = builder.where(
        sql`(created_at, id)`,
        "<",
        sql`(${cursorDate}, ${cursorId})`
      );
    }

    return builder.execute();
  }
}
