import { Migration, MigrationProvider } from "kysely";
import path from "path";
import url from "url";
import { promises as fs } from "fs";

export class ESMFileMigrationProvider implements MigrationProvider {
  constructor(private relativePath: string) {}

  async getMigrations(): Promise<Record<string, Migration>> {
    const migrations: Record<string, Migration> = {};
    const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
    const resolvedPath = path.resolve(__dirname, this.relativePath);
    const files = await fs.readdir(resolvedPath);

    for (const fileName of files) {
      if (!fileName.endsWith(".ts")) {
        continue;
      }

      const importPath = path
        .join(this.relativePath, fileName)
        .replaceAll("\\", "/");
      const migration = await import(importPath);
      const migrationKey = fileName.substring(0, fileName.lastIndexOf("."));

      migrations[migrationKey] = migration;
    }

    return migrations;
  }
}
