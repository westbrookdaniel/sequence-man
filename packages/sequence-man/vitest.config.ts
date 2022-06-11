import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    setupFiles: "src/setupTests.tsx",
    environment: "happy-dom",
    coverage: {
      all: true,
      src: ["src"],
      // Require 100% test coverage
      "100": true,
    },
  },
});
