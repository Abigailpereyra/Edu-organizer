const { defineConfig } = require("cypress");
require('dotenv').config();
module.exports = defineConfig({
  e2e: {
    baseUrl: "https://edu-organizer-qa.vercel.app",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    MAILSLURP_API_KEY: process.env.MAILSLURP_API_KEY
  }
});
