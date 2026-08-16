const { JSDOM } = require("jsdom");
JSDOM.fromURL("http://localhost:5174/", { runScripts: "dangerously", resources: "usable" }).then(dom => {
  dom.window.addEventListener("error", (e) => {
    console.error("JSDOM CAUGHT ERROR:", e.error.message, e.error.stack);
  });
  dom.window.addEventListener("unhandledrejection", (e) => {
    console.error("JSDOM PROMISE ERROR:", e.reason);
  });
  setTimeout(() => {
    console.log("JSDOM test complete.");
    process.exit(0);
  }, 5000);
});
