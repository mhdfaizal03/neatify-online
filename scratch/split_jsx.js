const fs = require('fs');

const content = fs.readFileSync('frontend/src/user/pages/Storefront.jsx', 'utf8');

function extractBetween(str, startStr, endStr) {
  const startIdx = str.indexOf(startStr);
  if (startIdx === -1) return null;
  const endIdx = str.indexOf(endStr, startIdx + startStr.length);
  if (endIdx === -1) return null;
  return str.substring(startIdx, endIdx + endStr.length);
}

const annPop = extractBetween(content, '<div className="ann-pop"', '</div>\n\n  {/* NAVBAR */}');
const navbar = extractBetween(content, '<nav className="navbar navbar-expand-lg" id="mainNav">', '</nav>');
const home = extractBetween(content, '<section className="hero-section" id="home">', '</section>\n\n  {/* LOGO TICKER */}');
const ticker = extractBetween(content, '<div className="logo-ticker">', '</div>\n\n  {/* SHOP SECTION */}');
const shop = extractBetween(content, '<section className="shop-section" id="shop">', '</section>\n\n  {/* PROCESS SECTION */}');
const process = extractBetween(content, '<section className="process-section" id="how-it-works">', '</section>\n\n  {/* STORY SECTION */}');
const story = extractBetween(content, '<section className="story-section" id="story">', '</section>\n\n  {/* CTA SECTION */}');
const cta = extractBetween(content, '<section className="cta-section">', '</section>\n\n  {/* FAQ SECTION */}');
const faq = extractBetween(content, '<section className="faq-section" id="faq">', '</section>\n\n  {/* FOOTER */}');
const footer = extractBetween(content, '<footer className="footer">', '</footer>');
const cart = extractBetween(content, '<div className="cart-overlay" id="cartOverlay"', '</div>\n    </>\n  );');

// Header
fs.writeFileSync('frontend/src/user/components/Header.jsx', `import React from 'react';
import { useCartStore } from '../../store/useCartStore';

export default function Header() {
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const openCart = () => {
    window.dispatchEvent(new Event('openCart'));
  };

  return (
    <>
      ${annPop ? annPop.replace('</div>\n\n  {/* NAVBAR */}', '</div>') : ''}
      ${navbar ? navbar.replace('<button className="nav-cart"', '<button className="nav-cart" onClick={openCart}') : ''}
    </>
  );
}
`);

// Hero
fs.writeFileSync('frontend/src/user/components/Hero.jsx', `import React from 'react';

export default function Hero() {
  return (
    <>
      ${home || ''}
      ${ticker || ''}
    </>
  );
}
`);

// Process
fs.writeFileSync('frontend/src/user/components/Process.jsx', `import React from 'react';

export default function Process() {
  return (
    <>
      ${process || ''}
      ${story || ''}
      ${cta || ''}
      ${faq || ''}
    </>
  );
}
`);

// Footer
fs.writeFileSync('frontend/src/user/components/Footer.jsx', `import React from 'react';

export default function Footer() {
  return (
    <>
      ${footer || ''}
    </>
  );
}
`);

console.log("Splitting JSX complete!");
