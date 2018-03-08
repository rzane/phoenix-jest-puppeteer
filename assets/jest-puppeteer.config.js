const path = require("path");

module.exports = {
  launch: {
    headless: process.env.HEADLESS !== "false"
  },
  server: {
    command: "cd .. && mix integration",
    port: 4001
  }
};
