import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: [
      'cypress/e2e/**/*.cy.js',
      '__tests__/e2e-tests/**/*.cy.js',
    ],
    excludeSpecPattern: [
      'cypress/e2e/**/1-getting-started/**',
      'cypress/e2e/**/2-advanced-examples/**',
    ],
  },
});
