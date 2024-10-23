import { config } from "dotenv";
import { Migrator, FileMigrationProvider, NO_MIGRATIONS } from "kysely";
import { beforeAll } from "vitest";
import { promises as fs } from "fs";
import * as path from "path";

import { db } from "~/server/providers/db";
import { ESMFileMigrationProvider } from "~/lib/ESMFileMigrationProvider";

// Load environment variables from .env file
config();

// Function to run migrations
async function runMigrations() {
  try {
    const migrator = new Migrator({
      db,
      provider: new ESMFileMigrationProvider(
        path.join(__dirname, "./src/server/db/migrations")
      ),
    });

    console.log(
      "migration folder",
      path.join(__dirname, "./src/server/db/migrations")
    );
    await migrator.migrateTo(NO_MIGRATIONS);
    await migrator.migrateToLatest();
  } catch (error) {
    console.error("Error running migrations:", error);
    process.exit(1);
  }
}

// Run migrations before tests
beforeAll(async () => {
  await runMigrations();
});
