import type { Kysely } from "kysely";
import { documentController } from "~/server/domains/document";
import { seedDocuments } from "./documents";
import { JSONContent } from "@tiptap/core";
import { qdrant } from "~/server/providers/qdrant";
import { mainQueue } from "~/server/queues";

export async function seed(db: Kysely<any>): Promise<void> {
  await db.deleteFrom("document").execute();

  await qdrant.deleteCollection("documents");
  await qdrant.createCollection("documents", {
    vectors: { size: 1536, distance: "Cosine" },
  });

  for (const document of seedDocuments) {
    const createdDocument = await documentController.createDocument({
      title: document.title,
      markdown: document.markdown,
      content: document.content as JSONContent,
    });

    await mainQueue.add("processDocument", {
      content: createdDocument.content as JSONContent,
      title: createdDocument.title ?? "",
      id: createdDocument.id,
      type: "PROCESS_DOCUMENT",
      markdown: createdDocument.markdown ?? "",
    });
  }
}
