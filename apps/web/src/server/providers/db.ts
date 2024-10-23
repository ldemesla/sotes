import { DB } from "../db/database.types"; // this is the Database interface we defined earlier
import { Pool } from "pg";
import pg from "pg";
import pgArray from "postgres-array";
import { Kysely, PostgresDialect } from "kysely";

import { parsePgDateAsIsoString } from "../utils/parsePgDateAsIsoString";
import { parsePgDateWithoutTimeAsString } from "../utils/parsePgDateWithoutTimeAsString";

const parseDateArray = (value: string) => {
  if (!value) {
    return null;
  }
  return pgArray.parse(value, parsePgDateAsIsoString);
};

pg.types.setTypeParser(1082, parsePgDateWithoutTimeAsString);
pg.types.setTypeParser(1114, parsePgDateAsIsoString);
pg.types.setTypeParser(1184, parsePgDateAsIsoString);
pg.types.setTypeParser(1115, parseDateArray);
pg.types.setTypeParser(1182, parseDateArray);
pg.types.setTypeParser(1185, parseDateArray);
pg.types.setTypeParser(20, "text", parseInt);

const dialect = new PostgresDialect({
  pool: new Pool({
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
