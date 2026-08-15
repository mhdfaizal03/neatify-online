const fs = require('fs');

const html = fs.readFileSync('scratch/old_code/user/index.html', 'utf8');

// Simple regex replacements for basic HTML to JSX conversion
let jsx = html
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
    // very naive style converter just for this specific file
    if(p1 === "max-width:480px;") return "style={{ maxWidth: '480px' }}";
    if(p1 === "margin-left:auto;") return "style={{ marginLeft: 'auto' }}";
    return match;
  })
  .replace(/<!--[\s\S]*?-->/g, ''); // remove comments

// Extract just the body content
const bodyMatch = jsx.match(/<body>([\s\S]*?)<script/);
if (bodyMatch) {
  const content = bodyMatch[1].trim();
  const component = `
import React from 'react';
import { useStorefrontLogic } from '../hooks/useStorefrontLogic';
import '../../user.css';

export default function Storefront() {
  useStorefrontLogic();

  return (
    <>
      ${content}
    </>
  );
}
  `;
  fs.writeFileSync('frontend/src/user/pages/Storefront.jsx', component);
  console.log("Converted to Storefront.jsx");
} else {
  console.log("Could not find body content");
}
