import { defineConfig } from "cypress";

const baseUrl = process.env.BASE_URL || "http://localhost:8888";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl,
  },
});
