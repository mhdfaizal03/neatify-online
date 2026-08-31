/**
 * Generates an ultra-premium SVG placeholder for products without an uploaded image.
 * Uses client-side SVG Data URI for instant rendering with zero network latency.
 */
export function getProductPlaceholderSvg(title = "Neatify Product", category = "Exterior Care") {
  const safeTitle = String(title || "Neatify Product").replace(/[<>&"]/g, "");
  const safeCat = String(category || "Exterior Care").toUpperCase().replace(/[<>&"]/g, "");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#080c10"/>
        <stop offset="50%" stop-color="#0f1722"/>
        <stop offset="100%" stop-color="#05080b"/>
      </linearGradient>
      <linearGradient id="limeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#c8f53c"/>
        <stop offset="100%" stop-color="#9ad81a"/>
      </linearGradient>
      <radialGradient id="glowGrad" cx="50%" cy="42%" r="40%">
        <stop offset="0%" stop-color="#c8f53c" stop-opacity="0.14"/>
        <stop offset="100%" stop-color="#0f1722" stop-opacity="0"/>
      </radialGradient>
      <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.025)" stroke-width="1"/>
      </pattern>
    </defs>

    <!-- Background -->
    <rect width="600" height="600" fill="url(#bgGrad)"/>
    <rect width="600" height="600" fill="url(#grid)"/>
    <circle cx="300" cy="250" r="220" fill="url(#glowGrad)"/>

    <!-- Subtle Tech Crosshairs -->
    <circle cx="300" cy="250" r="140" fill="none" stroke="rgba(200,245,60,0.12)" stroke-width="1.5" stroke-dasharray="6,8"/>
    <circle cx="300" cy="250" r="85" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    <line x1="130" y1="250" x2="470" y2="250" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
    <line x1="300" y1="80" x2="300" y2="420" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>

    <!-- Center Icon: Luxury Bottle / Shield Outline -->
    <g transform="translate(260, 190)">
      <!-- Shield / Bottle Graphic -->
      <path d="M40 0 C48 0 54 6 54 14 L54 22 C68 28 78 42 78 60 L78 110 C78 118 72 124 64 124 L16 124 C8 124 2 118 2 110 L2 60 C2 42 12 28 26 22 L26 14 C26 6 32 0 40 0 Z" fill="rgba(15,23,34,0.85)" stroke="url(#limeGrad)" stroke-width="2.5"/>
      <line x1="26" y1="22" x2="54" y2="22" stroke="rgba(200,245,60,0.4)" stroke-width="2"/>
      <circle cx="40" cy="75" r="16" fill="rgba(200,245,60,0.15)" stroke="#c8f53c" stroke-width="1.5"/>
      <path d="M40 68 L40 82 M33 75 L47 75" stroke="#c8f53c" stroke-width="1.5" stroke-linecap="round"/>
    </g>

    <!-- Brand Typography -->
    <text x="300" y="380" font-family="'Space Grotesk', -apple-system, sans-serif" font-size="28" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="-0.5">
      Neatify<tspan fill="#c8f53c">.</tspan>
    </text>

    <!-- Category Pill -->
    <rect x="200" y="405" width="200" height="24" rx="4" fill="rgba(200,245,60,0.1)" stroke="rgba(200,245,60,0.3)" stroke-width="1"/>
    <text x="300" y="421" font-family="'Space Grotesk', sans-serif" font-size="10" font-weight="700" fill="#c8f53c" text-anchor="middle" letter-spacing="2">
      ${safeCat}
    </text>

    <!-- Product Title -->
    <text x="300" y="465" font-family="'Inter', sans-serif" font-size="15" font-weight="600" fill="rgba(255,255,255,0.75)" text-anchor="middle">
      ${safeTitle.length > 28 ? safeTitle.slice(0, 26) + '…' : safeTitle}
    </text>

    <!-- Bottom Tag -->
    <text x="300" y="520" font-family="'Space Grotesk', sans-serif" font-size="9" font-weight="700" fill="rgba(255,255,255,0.25)" text-anchor="middle" letter-spacing="3">
      OFFICIAL VEHICLE CARE
    </text>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
