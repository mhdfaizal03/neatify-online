const fs = require('fs');

const prompt = fs.readFileSync('scratch/user_prompt.txt', 'utf8');

const htmlEnd = prompt.indexOf('</html>') + 7;
const htmlStr = prompt.slice(0, htmlEnd);

const cssStart = prompt.indexOf('/* ══════════════════════════════════════════════════════════\n   NEATIFY — Material Design 3 Premium Storefront');
const jsStr = prompt.slice(htmlEnd, cssStart).trim();
const cssStr = prompt.slice(cssStart).trim();

fs.writeFileSync('scratch/old_code/user/index.html', htmlStr);
fs.writeFileSync('scratch/old_code/user/script.js', jsStr);
fs.writeFileSync('scratch/old_code/user/style.css', cssStr);
console.log("Split complete!");
