const fs = require('fs');

const prompt = fs.readFileSync('scratch/full_prompt_found.txt', 'utf8');

// The format usually has <!doctype html>... </html> then script then css
// Or maybe it has "10. <!doctype html>"
const htmlStart = prompt.indexOf('<!doctype html>');
if (htmlStart === -1) {
    console.error("No html found");
    process.exit(1);
}

const htmlEnd = prompt.indexOf('</html>', htmlStart) + 7;
const htmlStr = prompt.slice(htmlStart, htmlEnd);

const cssStart = prompt.indexOf('/* ══════════════════════════════════════════════════════════\n   NEATIFY — Material Design 3 Premium Storefront');

if (cssStart === -1) {
    console.error("No css start found");
    process.exit(1);
}

const jsStr = prompt.slice(htmlEnd, cssStart).trim();
const cssStr = prompt.slice(cssStart).trim();

fs.writeFileSync('scratch/old_code/user/index.html', htmlStr);
fs.writeFileSync('scratch/old_code/user/script.js', jsStr);
fs.writeFileSync('scratch/old_code/user/style.css', cssStr);
console.log("Split complete!");
