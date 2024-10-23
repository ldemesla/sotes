import { defineConfig } from "kysely-ctl";
import { db } from "../src/server/providers/db";

export default defineConfig({
  kysely: db,

  migrations: {
    migrationFolder: "./src/server/db/migrations",
  },
  seeds: {
    seedFolder: "./src/server/db/seeds",
  },
  //   plugins: [],
});
