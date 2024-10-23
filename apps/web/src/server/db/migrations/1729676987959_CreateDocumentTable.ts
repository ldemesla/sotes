import { sql, type Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  const res = await db.schema
    .createTable("document")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("title", "varchar")
    .addColumn("content", "jsonb")
    .addColumn("created_at", "timestamp", (col) => col.defaultTo(sql`now()`))
    .addColumn("updated_at", "timestamp", (col) => col.defaultTo(sql`now()`))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  db.schema.dropTable("document");
}
