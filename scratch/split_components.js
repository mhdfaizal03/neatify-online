const fs = require('fs');

let storefront = fs.readFileSync('frontend/src/user/pages/Storefront.jsx', 'utf8');

// Find the start of the return statement
const returnIndex = storefront.indexOf('return (');
const bodyStartIndex = storefront.indexOf('<>', returnIndex) + 2;
const bodyEndIndex = storefront.lastIndexOf('</>');
const body = storefront.substring(bodyStartIndex, bodyEndIndex);

// We need to split the body into logical sections based on the HTML comments.

function extractBetween(str, startToken, endToken) {
  const start = str.indexOf(startToken);
  if (start === -1) return '';
  const end = str.indexOf(endToken, start + startToken.length);
  if (end === -1) return str.substring(start);
  return str.substring(start, end);
}

// 1. Header (ann-pop, navbar, mobile drawer, search bar)
const headerStart = body.indexOf('<div className="ann-pop"');
const heroStart = body.indexOf('<main id="home">');
const headerHtml = body.substring(headerStart, heroStart);

// 2. Hero (heroSection, marquee-strip)
const shopStart = body.indexOf('<!-- SHOP -->');
const heroHtml = body.substring(heroStart, shopStart);

// 3. ProductGrid (shop sec, bundle-wrap)
const processStart = body.indexOf('<!-- PROCESS -->');
const shopHtml = body.substring(shopStart, processStart);

// 4. Process (how-it-works, interior, story, reviews, faq, news)
const footerStart = body.indexOf('<!-- FOOTER -->');
const processHtml = body.substring(processStart, footerStart);

// 5. Footer (site-footer, btt)
const toastStart = body.indexOf('<!-- TOAST CONTAINER -->');
const footerHtml = body.substring(footerStart, toastStart);

// 6. Modals (toast, cart drawer, product modal, notify, auth, account, checkout)
const modalsHtml = body.substring(toastStart);


// Function to create component file
function createComponent(name, content) {
  const code = `import React from 'react';

export default function ${name}() {
  return (
    <>
      ${content.trim()}
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

// Now rewrite Storefront.jsx
const newStorefront = `import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import Process from '../components/Process';
import Footer from '../components/Footer';
import Modals from '../components/Modals';
import { useStorefrontLogic } from '../hooks/useStorefrontLogic';
import '../../user.css';

export default function Storefront() {
  useStorefrontLogic();

  return (
    <>
      <Header />
      <Hero />
      <ProductGrid />
      <Process />
      <Footer />
      <Modals />
    </>
  );
}
`;
fs.writeFileSync('frontend/src/user/pages/Storefront.jsx', newStorefront);

console.log("Components modularized successfully.");
