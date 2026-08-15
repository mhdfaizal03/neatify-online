const fs = require('fs');

let html = fs.readFileSync('scratch/old_code/user/index.html', 'utf8');

// We need to split the html into logical sections based on the HTML comments.

// 1. Header
const headerStart = html.indexOf('<div class="ann-pop"');
const heroStart = html.indexOf('<main id="home">');
const headerHtml = html.substring(headerStart, heroStart);

// 2. Hero
const shopStart = html.indexOf('<!-- SHOP -->');
const heroHtml = html.substring(heroStart, shopStart);

// 3. ProductGrid
const processStart = html.indexOf('<!-- PROCESS -->');
const shopHtml = html.substring(shopStart, processStart);

// 4. Process
const footerStart = html.indexOf('<!-- FOOTER -->');
const processHtml = html.substring(processStart, footerStart);

// 5. Footer
const toastStart = html.indexOf('<!-- TOAST CONTAINER -->');
const footerHtml = html.substring(footerStart, toastStart);

// 6. Modals
const bodyEnd = html.indexOf('<script src="https://cdnjs.cloudflare.com');
const modalsHtml = html.substring(toastStart, bodyEnd);


function toJSX(str) {
  let jsx = str
    .replace(/class=/g, 'className=')
    .replace(/for=/g, 'htmlFor=')
    .replace(/tabindex=/g, 'tabIndex=')
    .replace(/autocomplete=/g, 'autoComplete=')
    .replace(/aria-hidden=/g, 'aria-hidden=')
    .replace(/aria-label=/g, 'aria-label=')
    .replace(/aria-live=/g, 'aria-live=')
    .replace(/aria-atomic=/g, 'aria-atomic=')
    .replace(/aria-pressed=/g, 'aria-pressed=')
    .replace(/aria-controls=/g, 'aria-controls=')
    .replace(/aria-expanded=/g, 'aria-expanded=')
    .replace(/aria-labelledby=/g, 'aria-labelledby=')
    .replace(/style="([^"]*)"/g, (match, p1) => {
      if(p1 === "max-width:480px;") return "style={{ maxWidth: '480px' }}";
      if(p1 === "margin-left:auto;") return "style={{ marginLeft: 'auto' }}";
      return match;
    })
    .replace(/<!--[\s\S]*?-->/g, '') // remove comments
    .replace(/<(input|img|br|hr|meta|link)([^>]*?)(?<!\/)>/g, '<$1$2 />'); // self close
  return jsx;
}


// Function to create component file
function createComponent(name, content) {
  const jsxContent = toJSX(content);
  const code = `import React from 'react';

export default function ${name}() {
  return (
    <>
      ${jsxContent.trim()}
    </>
  );
}
`;
  fs.writeFileSync(`frontend/src/user/components/${name}.jsx`, code);
}

createComponent('Header', headerHtml);
createComponent('Hero', heroHtml);
createComponent('ProductGrid', shopHtml);
createComponent('Process', processHtml);
createComponent('Footer', footerHtml);
createComponent('Modals', modalsHtml);

console.log("Components modularized correctly this time.");
