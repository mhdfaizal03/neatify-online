/* Vercel serverless entry — re-exports the Express app from backend/server.js.
   All API routes flow through this function via the rewrite in vercel.json. */
module.exports = require("../backend/server.js");
