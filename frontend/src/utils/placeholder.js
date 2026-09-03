/** Generates a branded, product-led fallback image without a network request. */
export function getProductPlaceholderSvg(title = "Neatify Product", category = "Exterior Care") {
  const safeTitle = String(title || "Neatify Product").replace(/[<>&"]/g, "");
  const safeCategory = String(category || "Exterior Care").toUpperCase().replace(/[<>&"]/g, "");
  const shortTitle = safeTitle.length > 30 ? `${safeTitle.slice(0, 28)}...` : safeTitle;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
    <defs>
      <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
        <path d="M32 0H0V32" fill="none" stroke="#ffffff" stroke-opacity=".06"/>
      </pattern>
      <filter id="shadow" x="-30%" y="-30%" width="160%" height="180%">
        <feDropShadow dx="0" dy="22" stdDeviation="18" flood-color="#050708" flood-opacity=".45"/>
      </filter>
    </defs>

    <rect width="600" height="600" fill="#131a1e"/>
    <rect width="600" height="600" fill="url(#grid)"/>
    <path d="M0 470H600V600H0Z" fill="#0b1013"/>
    <path d="M48 64H190" stroke="#c8f53c" stroke-width="3"/>
    <text x="48" y="94" fill="#c8f53c" font-family="Space Grotesk, sans-serif" font-size="12" font-weight="700" letter-spacing="3">NEATIFY / 01</text>

    <g filter="url(#shadow)">
      <ellipse cx="300" cy="436" rx="150" ry="18" fill="#050708" opacity=".8"/>
      <path d="M177 278L390 206L430 326L220 398Z" fill="#dce7df" stroke="#9eb1a9" stroke-width="4"/>
      <path d="M177 278L390 206L367 286L200 343Z" fill="#eef3ee"/>
      <path d="M220 398L430 326L397 405L258 454Z" fill="#becfc6"/>
      <path d="M177 278L220 398L258 454L214 334Z" fill="#c9d8d0"/>
      <path d="M205 294L385 233M218 324L400 263M231 354L414 293M244 384L426 323" stroke="#a7bdb3" stroke-width="3" opacity=".75"/>
      <path d="M273 246L348 221L375 308L300 333Z" fill="#162126"/>
      <path d="M289 258L334 243" stroke="#c8f53c" stroke-width="3"/>
      <text x="323" y="278" fill="#ffffff" font-family="Space Grotesk, sans-serif" font-size="13" font-weight="800" text-anchor="middle" transform="rotate(-18 323 278)">NEATIFY<tspan fill="#c8f53c">.</tspan></text>
      <text x="329" y="295" fill="#9eb0aa" font-family="Space Grotesk, sans-serif" font-size="7" font-weight="700" text-anchor="middle" letter-spacing="1.5" transform="rotate(-18 329 295)">${safeCategory.slice(0, 15)}</text>
      <circle cx="425" cy="169" r="28" fill="#5aa8e8"/>
      <path d="M425 152C414 165 414 176 425 184C436 176 436 165 425 152Z" fill="#dff2ff"/>
      <path d="M457 190L469 178M463 184L457 172" stroke="#c8f53c" stroke-width="3" stroke-linecap="round"/>
    </g>

    <text x="48" y="532" fill="#ffffff" font-family="Space Grotesk, sans-serif" font-size="24" font-weight="800">${shortTitle}</text>
    <text x="48" y="560" fill="#8fa19a" font-family="Space Grotesk, sans-serif" font-size="10" font-weight="700" letter-spacing="3">VEHICLE CARE / READY TO DETAIL</text>
    <circle cx="548" cy="544" r="12" fill="#5aa8e8"/>
    <path d="M544 544H552M548 540V548" stroke="#0b1013" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
