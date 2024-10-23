import { Kysely, PostgresDialect } from "kysely";
import { pg, DB } from "shared";

const dialect = new PostgresDialect({
  pool: new pg.Pool({
    database:
      process.env.NODE_ENV === "test"
        ? process.env.TEST_DB_NAME
        : process.env.DB_NAME,
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || "5434"),
    max: 10,
  }),
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<DB>({
  dialect,
});
