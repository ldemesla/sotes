import { defineConfig } from "vitest/config";
import dotenv from "dotenv";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    setupFiles: ["dotenv/config"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
});
