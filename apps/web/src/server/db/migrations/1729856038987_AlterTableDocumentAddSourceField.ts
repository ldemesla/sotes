import type { Kysely } from "kysely";
import { sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("document")
    .addColumn("sources", sql`text[]`)
    .execute();
  await db.schema
    .alterTable("generated_note")
    .addColumn("sources", sql`text[]`)
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable("document").dropColumn("sources").execute();
  await db.schema.alterTable("generated_note").dropColumn("sources").execute();
}
