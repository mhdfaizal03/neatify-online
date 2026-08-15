const fs = require('fs');

let content = fs.readFileSync('frontend/src/user/pages/Storefront.jsx', 'utf8');

// Self close unclosed elements
content = content.replace(/<(input|img|br|hr|meta|link)([^>]*?)(?<!\/)>/g, '<$1$2 />');

// Special cases:
// 1. the word class instead of className inside JSX but outside string quotes.
// The html_to_jsx replaced class= with className= which covers most cases, but lets be sure.
// 2. Unexpected token at end?
// Looking at the error:
// [builtin:vite-transform] Unexpected token. Did you mean `{'}'}` or `&rbrace;`?
//     ╭─[ src/user/pages/Storefront.jsx:686:1 ]

fs.writeFileSync('frontend/src/user/pages/Storefront.jsx', content);
