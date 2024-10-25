import { sql, type Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("generated_note")
    .addColumn("id", "uuid", col => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("title", "varchar")
    .addColumn("content", "jsonb")
    .addColumn("markdown", "text")
    .addColumn("created_at", "timestamptz", col => col.defaultTo(sql`now()`))
    .addColumn("updated_at", "timestamptz", col => col.defaultTo(sql`now()`))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("generated_note").execute();
}
