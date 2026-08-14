/* Vercel serverless entry — re-exports the Express app from server.js.
   All routes (storefront, admin, assets, API) flow through this function
   via the rewrite in vercel.json. */
module.exports = require("../server.js");
