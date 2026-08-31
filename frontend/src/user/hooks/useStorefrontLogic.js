import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  buildWhatsAppUrl,
  buildProductOrderMessage,
  buildProductInquiryMessage,
  buildProductShareText,
  buildCartOrderMessage,
  buildKitOrderMessage,
  shareToWhatsApp,
  DEFAULT_WHATSAPP_NUMBER,
  saveCustomerDeliveryDetails,
  loadCustomerDeliveryDetails,
  formatDeliveryDetailsBlock,
} from '../../utils/whatsapp';
import { getProductPlaceholderSvg } from '../../utils/placeholder';

export function useStorefrontLogic() {
  const navigate = useNavigate();
  useEffect(() => {
    const rootEl = document.getElementById("home") || document.getElementById("productPage");
    if (rootEl && rootEl.dataset.initialized === "true") return;
    if (rootEl) rootEl.dataset.initialized = "true";

    // --- PASTE VANILLA LOGIC ---
    /* ═══════════════════════════════════════════════════════════
   NEATIFY STOREFRONT — script.js v6
   ═══════════════════════════════════════════════════════════ */

const CART_KEY = "neatify-cart-v2";
const SHIPPING_FEE = 49;
const TOKEN_KEY = "neatify-token";
const USER_KEY  = "neatify-user";

/* Stored customer session (token + profile) survives reloads */
let session = { token: "", user: null };
try {
  session.token = localStorage.getItem(TOKEN_KEY) || "";
  session.user = JSON.parse(localStorage.getItem(USER_KEY) || "null");
} catch { /* storage unavailable — session stays in memory */ }
let pendingCheckout = false;

let products = [];
let categories = [];
let settings = { freeShippingThreshold: 999, weekendKitIds: [1, 2, 4, 7], highlightProductId: 3 };
let state = { filter: "all", search: "", sort: "featured", cart: [] };

const $ = (id) => document.getElementById(id);
const hasBS = typeof window.bootstrap !== "undefined";
const noopUi = { show() {}, hide() {}, toggle() {} };

const productModal   = hasBS ? bootstrap.Modal.getOrCreateInstance("#productModal")     : noopUi;
const notifyModal    = hasBS ? bootstrap.Modal.getOrCreateInstance("#notifyModal")      : noopUi;
const checkoutModal  = hasBS ? bootstrap.Modal.getOrCreateInstance("#checkoutModal")    : noopUi;
const orderSuccModal = hasBS ? bootstrap.Modal.getOrCreateInstance("#orderSuccessModal"): noopUi;
const cartDrawer     = hasBS ? bootstrap.Offcanvas.getOrCreateInstance("#cartDrawer")   : noopUi;
const authModal      = hasBS ? bootstrap.Modal.getOrCreateInstance("#authModal")        : noopUi;
const accountModal   = hasBS ? bootstrap.Modal.getOrCreateInstance("#accountModal")     : noopUi;
const navCollapse    = hasBS ? bootstrap.Collapse.getOrCreateInstance($("navMenu"), { toggle: false }) : noopUi;

/* ── HELPERS ────────────────────────────────────────────── */
const money = (v) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);

const getProduct = (id) => products.find((p) => String(p.id) === String(id));

const matchesSearch = (p, q) => {
  if (!q) return true;
  return `${p.name} ${p.type} ${p.category} ${p.description}`.toLowerCase().includes(q.toLowerCase());
};

function esc(str) {
  const d = document.createElement("div");
  d.textContent = str == null ? "" : String(str);
  return d.innerHTML;
}

const KNOWN_ACTUAL_IMAGES = new Set([
  "assets/product-2.jpeg",
  "assets/product-8.jpeg",
  "/assets/product-2.jpeg",
  "/assets/product-8.jpeg",
  "assets/interior-teaser.png",
  "/assets/interior-teaser.png"
]);

function getImgUrl(img, p = {}) {
  if (img && (img.startsWith("data:") || img.startsWith("blob:") || img.startsWith("http://") || img.startsWith("https://"))) {
    return img;
  }
  const clean = img ? img.replace(/^\//, "") : "";
  if (clean && (KNOWN_ACTUAL_IMAGES.has(clean) || KNOWN_ACTUAL_IMAGES.has(`/${clean}`))) {
    return `/${clean}`;
  }
  return getProductPlaceholderSvg(p.name || "Neatify Detail Product", p.type || p.category || "Vehicle Care");
}

const BASE_URL = import.meta.env.VITE_API_URL || "";
async function api(path, opts = {}) {
  const headers = { "Content-Type": "application/json", ...(opts.headers || {}) };
  if (session.token && !headers.Authorization) headers.Authorization = `Bearer ${session.token}`;
  const res = await fetch(BASE_URL + path, { ...opts, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

/* ── SETTINGS ───────────────────────────────────────────── */
async function loadSettings() {
  try {
    const data = await api("/api/settings");
    settings = { ...settings, ...data };
  } catch { /* keep defaults */ }
  const ann = $("announceMain");
  if (ann) ann.textContent = settings.announcement || "Premium vehicle care, made simple.";
  const sub = $("announceSub");
  if (sub) sub.textContent = settings.announcementSub || `Free shipping on orders above ${money(settings.freeShippingThreshold)}.`;
  const faqT = $("faqShipThreshold");
  if (faqT) faqT.textContent = money(settings.freeShippingThreshold);
  const heroS = $("heroShipNote");
  if (heroS) heroS.textContent = money(settings.freeShippingThreshold);
  document.title = `${settings.storeName || "Neatify"} — Clean. Shine. Protect.`;

  const keywords = settings.marqueeKeywords || ["DEEP DIRT LIFT", "PAINT-SAFE FORMULA", "THICK CLINGING FOAM", "CRYSTAL GLOSS FINISH", "pH-NEUTRAL & WAX-SAFE", "STREAK-FREE EVERY TIME"];
  const marqueeHtml = keywords.map(kw => `<span>${esc(kw)}</span><span class="dot">◆</span>`).join("");
  document.querySelectorAll(".marquee-group").forEach(g => {
    g.innerHTML = marqueeHtml;
  });
}

/* ── CATEGORIES ────────────────────────────────────────── */
async function loadCategories() {
  try {
    categories = await api("/api/categories");
    renderFilterPills();
  } catch (err) {
    console.error("Failed to load categories", err);
    categories = [
      { id: "wash", name: "Wash" },
      { id: "tools", name: "Tools" },
      { id: "kit", name: "Kits" },
      { id: "finish", name: "Finish" }
    ];
    renderFilterPills();
  }
}

function renderFilterPills() {
  const container = $("filterPills");
  if (!container) return;
  
  const activeFilter = state.filter || "all";
  container.innerHTML = `
    <button class="f-pill ${activeFilter === 'all' ? 'active' : ''}" data-filter="all" aria-pressed="${activeFilter === 'all' ? 'true' : 'false'}">All</button>
    ${categories.map(c => `
      <button class="f-pill ${activeFilter === c.id ? 'active' : ''}" data-filter="${c.id}" aria-pressed="${activeFilter === c.id ? 'true' : 'false'}">${esc(c.name)}</button>
    `).join("")}
  `;
  renderPillCounts();
}

/* ── PRODUCTS ───────────────────────────────────────────── */
async function loadProducts(attempt = 1) {
  const grid = $("productGrid");
  if (grid) {
    grid.innerHTML = `<div class="col-12"><div class="grid-loading"><div class="spin-ring"></div><span>Loading products…</span></div></div>`;
  }
  try {
    products = await api("/api/products");
    window.products = products;
  } catch {
    if (attempt < 3) {
      await new Promise(r => setTimeout(r, 600 * attempt));
      return loadProducts(attempt + 1);
    }
    if (grid) grid.innerHTML = "";
    $("emptyState")?.classList.remove("d-none");
    const emptyTitle = $("emptyStateTitle");
    if (emptyTitle) emptyTitle.textContent = "Couldn't load products";
    const emptyText = $("emptyStateText");
    if (emptyText) emptyText.textContent = "Make sure the server is running (npm start) and open http://localhost:3000.";
    $("retryProducts")?.classList.remove("d-none");
    return;
  }
  $("retryProducts")?.classList.add("d-none");
  renderPillCounts();
  renderBundle();
  renderProducts();
}

function renderPillCounts() {
  document.querySelectorAll(".f-pill").forEach((pill) => {
    const key = pill.dataset.filter;
    const count = key === "all" ? products.length : products.filter(p => p.category === key).length;
    const label = pill.textContent.replace(/\s*\d+$/, "").trim();
    pill.innerHTML = `${esc(label)}<span class="pill-count">${count}</span>`;
  });
}

function renderBundle() {
  const kitProducts = products.filter(p => p.isKit && p.active !== false);
  const wrap = document.getElementById("kitOffersContainer");
  const list = document.getElementById("kitOffersList");
  
  if (!wrap) return;

  if (!kitProducts.length) {
    wrap.style.display = "none";
    if (list) list.innerHTML = "";
    return;
  }
  
  wrap.style.display = "block";
  if (list) {
    const kit = kitProducts[0];
    const itemCount = kit.includedProducts && kit.includedProducts.length > 0
      ? kit.includedProducts.length
      : (kit.points ? kit.points.length : 1);
    
    let firstPart = "";
    let restPart = "";
    
    if (kit.name.includes('.')) {
      const parts = kit.name.split('.');
      firstPart = parts[0].trim() + '.';
      restPart = parts.slice(1).join('.').trim();
    } else {
      const parts = kit.name.split(" ");
      firstPart = parts.shift() || "";
      restPart = parts.join(" ");
    }

    const pointsHtml = (kit.points || []).slice(0, 3).map(pt => `
      <li style="display: flex; align-items: center; gap: 8px; font-size: 0.88rem; color: rgba(255,255,255,0.85); margin-bottom: 6px;">
        <i class="bi bi-check2" style="color: var(--lime); font-size: 1.1rem; flex-shrink: 0;"></i>
        <span>${esc(pt)}</span>
      </li>
    `).join("");

    const hasMultiImg = kit.images && kit.images.length > 1;
    const imgSectionHtml = hasMultiImg ? `
      <div class="bundle-img-wrap bundle-multi-grid">
        <div class="bundle-main-img">
          <img src="${getImgUrl(kit.images[0], kit)}" alt="${esc(kit.name)}" />
        </div>
        <div class="bundle-sub-img">
          <span class="bundle-offer-pill"><i class="bi bi-gift-fill me-1"></i> Offer Item Included</span>
          <img src="${getImgUrl(kit.images[1], kit)}" alt="Offer Item Included" />
        </div>
      </div>
    ` : `
      <div class="bundle-img-wrap">
        <img src="${getImgUrl(kit.image, kit)}" alt="${esc(kit.name)}" />
      </div>
    `;
    
    list.innerHTML = `
    <div class="bundle-card reveal visible" data-id="${kit.id}">
      <div class="bundle-copy">
        <div class="d-flex align-items-center gap-2 mb-2">
          <p class="sec-eyebrow mb-0">— ${esc(kit.badge || "FEATURED KIT OFFER")}</p>
          ${kitProducts.length > 1 ? `<span class="badge-pill" style="font-size: 0.72rem; padding: 2px 8px;">1 of ${kitProducts.length} Kits</span>` : ''}
        </div>
        <h2 class="bundle-title">${esc(firstPart)}<br /><em>${esc(restPart)}</em></h2>
        <p class="bundle-desc">${esc(kit.description)}</p>
        <button class="btn-lime" data-kit-id="${kit.id}">Add to Cart</button>
        <button class="btn-ghost-lime see-more-kits" id="seeMoreKitsBtn" type="button">See more kits <i class="bi bi-arrow-right"></i></button>
        <span class="bundle-price ms-auto">${itemCount} items · ${money(kit.price)}</span>
      </div>
      ${imgSectionHtml}
    </div>
    `;
  }
}

function filteredProducts() {
  let list = products.filter(p => {
    if (p.isKit) return state.filter === "kit" || state.filter === "all";
    return state.filter === "all" || p.category === state.filter;
  });
  if (state.search) list = list.filter(p => matchesSearch(p, state.search));
  if (state.sort === "featured") list.sort((a, b) => a.featured - b.featured);
  if (state.sort === "low")      list.sort((a, b) => a.price - b.price);
  if (state.sort === "high")     list.sort((a, b) => b.price - a.price);
  if (state.sort === "name")     list.sort((a, b) => a.name.localeCompare(b.name));
  return list;
}

function renderProducts() {
  const list = filteredProducts();
  const grid = $("productGrid");
  const empty = $("emptyState");
  if (empty) empty.classList.toggle("d-none", list.length !== 0);
  if (!grid) return;
  if (!list.length) {
    if ($("emptyStateTitle")) $("emptyStateTitle").textContent = "No products found";
    if ($("emptyStateText")) $("emptyStateText").textContent = "Try another search or category.";
    grid.innerHTML = "";
    return;
  }
  grid.innerHTML = list.map(p => {
    const isMultiImg = p.images && p.images.length > 1;
    const imgHtml = isMultiImg ? `
      <div class="prod-dual-grid">
        <img src="${getImgUrl(p.images[0], p)}" alt="${esc(p.name)}" class="dual-main" loading="lazy">
        <div class="dual-sub">
          <img src="${getImgUrl(p.images[1], p)}" alt="Offer item" loading="lazy">
          <span class="offer-tag"><i class="bi bi-gift-fill"></i> Bonus</span>
        </div>
      </div>
    ` : `
      <img src="${getImgUrl(p.image, p)}" alt="${esc(p.name)}" loading="lazy">
    `;

    return `
    <div class="col-6 col-lg-4 col-xl-3">
      <article class="product-card ${p.isKit ? 'kit-card' : ''}">
        <div class="prod-img ${isMultiImg ? 'has-multi-img' : ''}" data-id="${p.id}" role="button" tabindex="0" aria-label="View ${esc(p.name)}">
          ${p.stock === 0 ? '<span class="prod-badge soldout">Sold Out</span>' : (p.stock < 5 ? `<span class="prod-badge lowstock">Only ${p.stock} left</span>` : (p.badge ? `<span class="prod-badge${p.id === settings.highlightProductId ? " lime" : ""}">${esc(p.badge)}</span>` : (p.isKit ? '<span class="prod-badge lime">KIT</span>' : '')))}
          <button class="prod-quick" data-view="${p.id}" aria-label="Quick view ${esc(p.name)}">
            <i class="bi bi-eye"></i>
          </button>
          ${imgHtml}
        </div>
        <div class="prod-body">
          <span class="prod-kicker">${esc(p.type)} / ${p.isKit ? 'BUNDLE' : 'Exterior'}</span>
          <h3>${esc(p.name)}</h3>
          <p>${esc(p.description)}</p>
          <div class="prod-foot">
            <span class="prod-price">${money(p.price)}</span>
            <div class="d-flex align-items-center gap-1 ms-auto">
              <button class="share-btn-card" data-share="${p.id}" title="Share product" aria-label="Share ${esc(p.name)}">
                <i class="bi bi-share"></i>
              </button>
              <button class="wa-btn-card" data-wa-order="${p.id}" title="Order on WhatsApp" aria-label="Order ${esc(p.name)} on WhatsApp">
                <i class="bi bi-whatsapp"></i>
              </button>
              ${p.stock === 0 ? `
              <button class="add-btn disabled" disabled style="background:#333;color:#666;cursor:not-allowed;" aria-label="${esc(p.name)} is sold out">
                <i class="bi bi-slash-circle"></i>
              </button>
              ` : `
              <button class="add-btn" data-add="${p.id}" title="Add to cart" aria-label="Add ${esc(p.name)} to cart">
                <i class="bi bi-plus-lg"></i>
              </button>
              `}
            </div>
          </div>
        </div>
      </article>
    </div>`;
  }).join("");
}

/* ── CART ───────────────────────────────────────────────── */
function loadCart() {
  try {
    const saved = localStorage.getItem(CART_KEY);
    if (!saved) return;
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) {
      state.cart = parsed.filter(item => getProduct(item.id) && item.qty > 0);
    }
  } catch { state.cart = []; }
}

function saveCart() { localStorage.setItem(CART_KEY, JSON.stringify(state.cart)); }

function subtotalValue() {
  return state.cart.reduce((sum, item) => {
    const p = getProduct(item.id);
    return p ? sum + p.price * item.qty : sum;
  }, 0);
}

function shippingFor(subtotal) {
  if (!state.cart.length) return 0;
  return subtotal >= (settings.freeShippingThreshold || 999) ? 0 : SHIPPING_FEE;
}

function addToCart(id, openDrawer = false) {
  const p = getProduct(id);
  if (!p) return;
  if (p.stock === 0) {
    showToast(`${p.name} is currently out of stock`, true);
    return;
  }
  const found = state.cart.find(i => String(i.id) === String(id));
  if (found) {
    if (found.qty >= p.stock) {
      showToast(`Only ${p.stock} units of ${p.name} are available`, true);
      return;
    }
    found.qty++;
  } else {
    state.cart.push({ id, qty: 1 });
  }
  saveCart();
  renderCart();
  bumpBadge();
  showToast(`${p.name} added`);
  if (openDrawer && cartDrawer) cartDrawer.show();
}

// Global cart bridge for cross-component access
window.addToCart = addToCart;
window.addBundle = addBundle;
window.renderCart = renderCart;
window.loadProducts = loadProducts;
window.products = products;
window.openCheckout = openCheckout;

function addBundle(ids) {
  const added = ids.map(getProduct).filter(Boolean);
  if (!added.length) return;
  const outOfStock = added.filter(p => p.stock === 0);
  if (outOfStock.length > 0) {
    showToast(`Some items in this kit are out of stock.`, true);
    return;
  }
  added.forEach(p => {
    const found = state.cart.find(i => String(i.id) === String(p.id));
    if (found) {
      if (found.qty < p.stock) found.qty++;
    } else {
      state.cart.push({ id: p.id, qty: 1 });
    }
  });
  saveCart();
  renderCart();
  bumpBadge();
  showToast("Weekend kit added to cart");
  if (cartDrawer) cartDrawer.show();
}

function bumpBadge() {
  const badge = $("cartCount");
  if (!badge) return;
  badge.classList.remove("bump");
  void badge.offsetWidth;
  badge.classList.add("bump");
}

function renderCart() {
  const count = state.cart.reduce((s, i) => s + i.qty, 0);
  const badge = $("cartCount");
  badge.textContent = count;
  badge.style.display = count ? "grid" : "none";

  const empty  = $("cartEmpty");
  const foot   = $("cartFooter");
  const items  = $("cartItems");

  if (!state.cart.length) {
    items.innerHTML = "";
    empty.classList.remove("d-none");
    foot.classList.add("d-none");
    return;
  }
  empty.classList.add("d-none");
  foot.classList.remove("d-none");

  items.innerHTML = state.cart.map(item => {
    const p = getProduct(item.id);
    if (!p) return "";
    return `<div class="cart-item">
      <img src="${getImgUrl(p.image, p)}" alt="${esc(p.name)}" onerror="this.src='${getProductPlaceholderSvg(p.name, p.type)}'">
      <div>
        <h4>${esc(p.name)}</h4>
        <p>${money(p.price)} each</p>
        <div class="qty-ctrl">
          <button data-qty="${p.id}" data-delta="-1" aria-label="Decrease">−</button>
          <strong aria-live="polite">${item.qty}</strong>
          <button data-qty="${p.id}" data-delta="1" aria-label="Increase">+</button>
        </div>
      </div>
      <button class="remove-btn" data-remove="${p.id}" aria-label="Remove ${esc(p.name)}">
        <i class="bi bi-trash3"></i>
      </button>
    </div>`;
  }).join("");

  const sub  = subtotalValue();
  const ship = shippingFor(sub);
  const subEl = $("cartSubtotal");
  if (subEl) subEl.textContent = money(sub);
  const shipEl = $("cartShipping");
  if (shipEl) shipEl.textContent = ship === 0 ? "FREE" : money(ship);
  const totalEl = $("cartTotal");
  if (totalEl) totalEl.textContent = money(sub + ship);
  renderShipProgress(sub);
}

function renderShipProgress(sub) {
  const threshold = settings.freeShippingThreshold || 999;
  const msg  = $("shipMessage");
  const fill = $("shipFill");
  if (sub >= threshold) {
    msg.innerHTML = `<b>Free shipping unlocked!</b> 🎉`;
    msg.classList.add("free");
    fill.style.width = "100%";
  } else {
    msg.innerHTML = `Add <b>${money(threshold - sub)}</b> more for free shipping`;
    msg.classList.remove("free");
    fill.style.width = `${Math.min(100, Math.round((sub / threshold) * 100))}%`;
  }
}

/* ── CHECKOUT (WHATSAPP DISPATCH) ─────────────────────── */
function openCheckout() {
  if (!state.cart.length) return;
  prefillCheckout();
  renderCheckoutSummary();
  cartDrawer.hide();
  checkoutModal.show();
}

/* Returning customers never re-type what we already know */
function prefillCheckout() {
  const saved = loadCustomerDeliveryDetails() || {};
  const u = session.user || {};

  const setVal = (id, val) => {
    const el = $(id);
    if (el && !el.value.trim() && val) el.value = val;
  };

  setVal("coName", saved.name || u.name);
  setVal("coPhone", saved.phone || u.phone);
  setVal("coAltPhone", saved.altPhone);
  setVal("coEmail", saved.email || u.email);
  setVal("coHouse", saved.house);
  setVal("coStreet", saved.street);
  setVal("coLocality", saved.locality);
  setVal("coCity", saved.city);
  setVal("coDistrict", saved.district);
  setVal("coState", saved.state);
  setVal("coPin", saved.pin);
  setVal("coLandmark", saved.landmark);
  setVal("coInstructions", saved.instructions);
}

function renderCheckoutSummary() {
  const items = state.cart.map(item => {
    const p = getProduct(item.id);
    if (!p) return "";
    return `<div class="co-line-item">
      <span>${esc(p.name)}<small>Qty ${item.qty} × ${money(p.price)}</small></span>
      <span>${money(p.price * item.qty)}</span>
    </div>`;
  }).join("");
  const itemsEl = $("checkoutItems");
  if (itemsEl) itemsEl.innerHTML = items;
  const sub  = subtotalValue();
  const ship = shippingFor(sub);
  const coSub = $("coSubtotal");
  if (coSub) coSub.textContent = money(sub);
  const coShip = $("coShipping");
  if (coShip) coShip.textContent = ship === 0 ? "FREE" : money(ship);
  const coTot = $("coTotal");
  if (coTot) coTot.textContent = money(sub + ship);
}

function validateCheckout() {
  let valid = true;
  const rules = [
    { id: "coName",       err: "coNameError",       test: v => v.length >= 2,                                  msg: "Enter full customer name" },
    { id: "coPhone",      err: "coPhoneError",      test: v => /^[+\d][\d\s\-()]{7,14}$/.test(v),             msg: "Enter valid WhatsApp number" },
    { id: "coHouse",      err: "coHouseError",      test: v => v.length >= 1,                                  msg: "Enter house / building name" },
    { id: "coStreet",     err: "coStreetError",     test: v => v.length >= 1,                                  msg: "Enter street / road name" },
    { id: "coLocality",   err: "coLocalityError",   test: v => v.length >= 1,                                  msg: "Enter area / locality" },
    { id: "coCity",       err: "coCityError",       test: v => v.length >= 1,                                  msg: "Enter city or town" },
    { id: "coDistrict",   err: "coDistrictError",   test: v => v.length >= 1,                                  msg: "Enter district" },
    { id: "coState",      err: "coStateError",      test: v => v.length >= 1,                                  msg: "Enter state" },
    { id: "coPin",        err: "coPinError",        test: v => /^\d{6}$/.test(v.replace(/\s/g, "")),           msg: "Enter 6-digit PIN code" },
  ];
  rules.forEach(rule => {
    const input = $(rule.id);
    const errEl = $(rule.err);
    if (!input) return;
    const ok = rule.test(input.value.trim());
    input.classList.toggle("invalid", !ok);
    if (errEl) errEl.textContent = ok ? "" : rule.msg;
    if (!ok) valid = false;
  });
  return valid;
}

async function placeOrder(e) {
  e.preventDefault();
  if (!validateCheckout() || !state.cart.length) return;
  const btn = $("placeOrderBtn");
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="loader-spin" style="width:14px;height:14px;border-width:1.5px;margin-right:0.4rem;"></span>Dispatching to WhatsApp…`;
  }

  const sub  = subtotalValue();
  const ship = shippingFor(sub);

  const customerData = {
    name: $("coName")?.value.trim() || "",
    phone: $("coPhone")?.value.trim() || "",
    altPhone: $("coAltPhone")?.value.trim() || "",
    email: $("coEmail")?.value.trim() || "",
    house: $("coHouse")?.value.trim() || "",
    street: $("coStreet")?.value.trim() || "",
    locality: $("coLocality")?.value.trim() || "",
    city: $("coCity")?.value.trim() || "",
    district: $("coDistrict")?.value.trim() || "",
    state: $("coState")?.value.trim() || "",
    pin: $("coPin")?.value.trim() || "",
    landmark: $("coLandmark")?.value.trim() || "",
    instructions: $("coInstructions")?.value.trim() || "",
  };

  customerData.address = [
    customerData.house,
    customerData.street,
    customerData.locality,
    customerData.city,
    customerData.district,
    customerData.state,
    customerData.pin ? `PIN: ${customerData.pin}` : ""
  ].filter(Boolean).join(", ");

  // 1. Save to customer browser localStorage for future auto-fill
  saveCustomerDeliveryDetails(customerData);

  const payload = {
    items: state.cart.map(item => {
      const p = getProduct(item.id);
      return { id: p.id, name: p.name, price: p.price, qty: item.qty };
    }),
    total: sub + ship,
    shipping: ship,
    source: "whatsapp",
    customer: customerData,
  };

  let orderId = `ORD-${Date.now().toString().slice(-6)}`;
  try {
    const order = await api("/api/orders", { method: "POST", body: JSON.stringify(payload) });
    if (order && order.id) orderId = order.id;
  } catch (err) {
    console.warn("Backend order logging note:", err.message);
  }

  // 2. Build WhatsApp Order message with full delivery details
  const waMsg = buildCartOrderMessage({
    items: payload.items,
    subtotal: sub,
    shipping: ship,
    total: sub + ship,
    customer: customerData,
    orderId: orderId,
  });

  const targetNumber = settings.whatsappNumber || DEFAULT_WHATSAPP_NUMBER;
  const waUrl = buildWhatsAppUrl(waMsg, targetNumber);

  // 3. Open WhatsApp
  window.open(waUrl, "_blank", "noopener,noreferrer");

  checkoutModal.hide();
  state.cart = [];
  saveCart();
  renderCart();

  if ($("orderIdChip")) $("orderIdChip").textContent = orderId;
  const reopenBtn = $("reopenWaBtn");
  if (reopenBtn) reopenBtn.href = waUrl;
  orderSuccModal.show();

  if (btn) {
    btn.disabled = false;
    btn.innerHTML = `<i class="bi bi-whatsapp fs-5"></i><span>Continue to WhatsApp →</span>`;
  }
}

/* ── ACCOUNT: session, auth modal, profile, orders ──────── */
const isLoggedIn = () => !!(session.token && session.user);

function setSession(token, user) {
  session.token = token;
  session.user = user;
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch { /* storage unavailable */ }
  updateAccountUi();
}

function clearSession() {
  session.token = "";
  session.user = null;
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch { /* storage unavailable */ }
  updateAccountUi();
}

function updateAccountUi() {
  const icon = $("accountIcon");
  if (!icon) return;
  icon.className = isLoggedIn() ? "bi bi-person-check-fill" : "bi bi-person-circle";
  $("accountBtn").title = isLoggedIn() ? `Hi, ${session.user.name.split(" ")[0]}` : "Sign in / Register";
}

function showAuthNotice(show) { $("authNotice").classList.toggle("d-none", !show); }

function authSwitch(tab) {
  const isLogin    = tab === "login";
  const isRegister = tab === "register";
  const isForgot   = tab === "forgot";

  $("authTabLogin").classList.toggle("active", isLogin);
  $("authTabRegister").classList.toggle("active", isRegister);

  // hide/show tab strip itself when on forgot
  $("authTabLogin").closest(".auth-tabs").style.display = isForgot ? "none" : "";

  $("loginForm").classList.toggle("d-none", !isLogin);
  $("registerForm").classList.toggle("d-none", !isRegister);
  $("forgotForm").classList.toggle("d-none", !isForgot);
  $("authError").classList.add("d-none");
}

function authFail(msg) {
  const el = $("authError");
  el.textContent = msg;
  el.classList.remove("d-none");
}

async function handleAuth(e, mode) {
  e.preventDefault();
  const email = (mode === "login" ? $("liEmail") : $("rgEmail")).value.trim();
  const password = (mode === "login" ? $("liPassword") : $("rgPassword")).value;
  const name = mode === "register" ? $("rgName").value.trim() : "";
  if (mode === "register" && name.length < 2) return authFail("Please enter your name");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return authFail("Please enter a valid email");
  if (password.length < 6) return authFail("Password must be at least 6 characters");

  const btn = mode === "login" ? $("loginBtn") : $("registerBtn");
  const original = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<span class="loader-spin" style="width:14px;height:14px;border-width:1.5px;margin-right:0.4rem;"></span>${mode === "login" ? "Signing in…" : "Creating…"}`;
  try {
    const data = await api(`/api/account/${mode}`, {
      method: "POST",
      body: JSON.stringify(mode === "login" ? { email, password } : { name, email, password }),
    });
    setSession(data.token, data.user);
    authModal.hide();
    showToast(`${mode === "login" ? "Welcome back" : "Account created — welcome"}, ${esc(data.user.name.split(" ")[0])}!`);
    if (pendingCheckout) { pendingCheckout = false; openCheckout(); }
  } catch (err) {
    authFail(err.message || "Something went wrong. Try again.");
  } finally {
    btn.disabled = false;
    btn.innerHTML = original;
  }
}

function openAccount() {
  const u = session.user;
  $("accAvatar").textContent = (u.name || "?").trim().charAt(0).toUpperCase();
  $("accName").textContent = u.name;
  $("accEmail").textContent = u.email;
  $("accSince").textContent = u.createdAt
    ? `Member since ${new Date(u.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}`
    : "";
  $("pfName").value = u.name || "";
  $("pfEmail").value = u.email || "";
  $("pfPhone").value = u.phone || "";
  $("pfAddress").value = u.address || "";
  document.querySelector('.acc-tab[data-acc="orders"]').click();
  accountModal.show();
}

function getOrderStepper(status) {
  const steps = [
    { label: "Pending", val: "pending", index: 0 },
    { label: "Processing", val: "processing", index: 1 },
    { label: "Shipped", val: "shipped", index: 2 },
    { label: "Delivered", val: "delivered", index: 3 }
  ];

  const currentStatus = String(status || "pending").toLowerCase();
  
  if (currentStatus === "cancelled") {
    return `<div class="stepper is-cancelled">
      <div class="stepper-progress" style="width: 100%;"></div>
      <div class="step cancelled" style="width: 100%;">
        <div class="step-dot"><i class="bi bi-x-lg"></i></div>
        <div class="step-label">Order Cancelled</div>
      </div>
    </div>`;
  }

  const activeIdx = steps.findIndex(s => s.val === currentStatus);
  const progressPercent = activeIdx >= 0 ? (activeIdx / (steps.length - 1)) * 100 : 0;

  const stepsHtml = steps.map((s, idx) => {
    let stateClass = "";
    let dotContent = idx + 1;
    if (idx < activeIdx) {
      stateClass = "completed";
      dotContent = '<i class="bi bi-check-lg"></i>';
    } else if (idx === activeIdx) {
      if (currentStatus === "delivered") {
        stateClass = "completed";
        dotContent = '<i class="bi bi-check-lg"></i>';
      } else {
        stateClass = "active";
      }
    }
    return `<div class="step ${stateClass}">
      <div class="step-dot">${dotContent}</div>
      <div class="step-label">${s.label}</div>
    </div>`;
  }).join("");

  return `<div class="stepper">
    <div class="stepper-progress" style="width: ${progressPercent}%;"></div>
    ${stepsHtml}
  </div>`;
}

async function loadAccountOrders() {
  const box = $("accOrders");
  box.innerHTML = `<div class="acc-empty"><div class="spin-ring"></div></div>`;
  let orders;
  try {
    orders = await api("/api/account/orders");
  } catch {
    box.innerHTML = `<div class="acc-empty"><p>Could not load orders.</p></div>`;
    return;
  }
  if (!orders.length) {
    box.innerHTML = `<div class="acc-empty"><i class="bi bi-box-seam"></i><p>No orders yet — your purchases will live here.</p></div>`;
    return;
  }
  box.innerHTML = orders.map((o) => {
    const status = String(o.status || "pending").toLowerCase();
    const date = new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    const lines = (o.items || []).map((it) =>
      `<span>${esc(it.name)} × ${it.qty}<small>${money((it.price || 0) * (it.qty || 1))}</small></span>`).join("");
    return `<div class="acc-order">
      <div class="acc-order-head">
        <span class="acc-order-id">${esc(o.id)}</span>
        <span class="acc-order-date">${date}</span>
      </div>
      <div class="acc-order-items">${lines}</div>
      ${getOrderStepper(status)}
      <div class="acc-order-total" style="margin-top: 1.2rem;"><span>Total</span><strong>${money(o.total || 0)}</strong></div>
    </div>`;
  }).join("");
}

async function saveProfile(e) {
  e.preventDefault();
  const btn = $("profileSaveBtn");
  btn.disabled = true;
  try {
    const u = await api("/api/account/profile", {
      method: "PUT",
      body: JSON.stringify({ name: $("pfName").value, phone: $("pfPhone").value, address: $("pfAddress").value }),
    });
    setSession(session.token, u);
    $("accAvatar").textContent = (u.name || "?").trim().charAt(0).toUpperCase();
    $("accName").textContent = u.name;
    showToast("Profile updated.");
  } catch (err) {
    showToast(err.message || "Could not save profile.", true);
  } finally {
    btn.disabled = false;
  }
}

async function savePassword(e) {
  e.preventDefault();
  const btn = $("passwordSaveBtn");
  btn.disabled = true;
  try {
    await api("/api/account/password", {
      method: "PUT",
      body: JSON.stringify({ current: $("pwCurrent").value, next: $("pwNext").value }),
    });
    $("passwordForm").reset();
    showToast("Password updated.");
  } catch (err) {
    showToast(err.message || "Could not update password.", true);
  } finally {
    btn.disabled = false;
  }
}

function initAccount() {
  updateAccountUi();

  /* Validate a stored session in the background and keep the nav in sync */
  if (session.token) {
    api("/api/account/me")
      .then((u) => { session.user = u; try { localStorage.setItem(USER_KEY, JSON.stringify(u)); } catch {} updateAccountUi(); })
      .catch(() => clearSession());
  }

  $("accountBtn")?.addEventListener("click", () => {
    if (isLoggedIn()) { openAccount(); return; }
    showAuthNotice(false);
    authSwitch("login");
    authModal.show();
  });

  $("authTabLogin")?.addEventListener("click", () => authSwitch("login"));
  $("authTabRegister")?.addEventListener("click", () => authSwitch("register"));

  // Forgot password flow
  $("forgotLink")?.addEventListener("click", () => authSwitch("forgot"));
  $("forgotBackBtn")?.addEventListener("click", () => authSwitch("login"));
  $("forgotForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = $("forgotEmail").value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      authFail("Please enter a valid email address.");
      return;
    }
    const btn = $("forgotBtn");
    const orig = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<span class="loader-spin" style="width:14px;height:14px;border-width:1.5px;margin-right:0.4rem;"></span>Sending…`;
    // Simulate a brief delay — no backend endpoint exists yet
    await new Promise(r => setTimeout(r, 1200));
    btn.disabled = false;
    btn.innerHTML = orig;
    authSwitch("login");
    showToast("If that email is registered, a reset link has been sent.");
  });
  document.querySelectorAll(".pw-eye").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = $(btn.dataset.eye);
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.querySelector("i").className = show ? "bi bi-eye-slash" : "bi bi-eye";
    });
  });

  $("loginForm")?.addEventListener("submit", (e) => handleAuth(e, "login"));
  $("registerForm")?.addEventListener("submit", (e) => handleAuth(e, "register"));

  document.querySelectorAll(".acc-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".acc-tab").forEach((t) => t.classList.toggle("active", t === tab));
      document.querySelectorAll(".acc-pane").forEach((p) => p.classList.remove("active"));
      $(`accPane${tab.dataset.acc.charAt(0).toUpperCase()}${tab.dataset.acc.slice(1)}`)?.classList.add("active");
      if (tab.dataset.acc === "orders") loadAccountOrders();
    });
  });

  $("profileForm")?.addEventListener("submit", saveProfile);
  $("passwordForm")?.addEventListener("submit", savePassword);
  $("logoutBtn")?.addEventListener("click", () => {
    clearSession();
    accountModal.hide();
    showToast("Signed out. See you soon!");
  });
}

/* ── SUBSCRIBE ──────────────────────────────────────────── */
async function subscribe(email, type, btn) {
  btn.disabled = true;
  try {
    const res = await api("/api/subscribers", { method: "POST", body: JSON.stringify({ email, type }) });
    showToast(res.duplicate
      ? (type === "newsletter" ? "Already subscribed." : "Already on the list.")
      : (type === "newsletter" ? "Welcome to Neatify Notes 💌" : "You're on the launch list 🔔"));
    return true;
  } catch (err) {
    showToast(err.message || "Subscription failed.", true);
    return false;
  } finally { btn.disabled = false; }
}

/* ── TOASTS ─────────────────────────────────────────────── */
function showToast(message, isError = false) {
  const el = document.createElement("div");
  el.className = "toast align-items-center border-0";
  el.setAttribute("role", "alert");
  el.setAttribute("aria-live", "assertive");
  const icon = isError ? "bi-exclamation-circle-fill text-danger" : "bi-check-circle-fill";
  el.innerHTML = `<div class="d-flex"><div class="toast-body"><i class="bi ${icon} me-2"></i>${esc(message)}</div>
    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button></div>`;
  $("toastContainer").appendChild(el);
  if (hasBS) {
    const t = new bootstrap.Toast(el, { delay: 2800 });
    t.show();
    el.addEventListener("hidden.bs.toast", () => el.remove());
  } else {
    setTimeout(() => el.remove(), 3000);
  }
}

/* ── PRODUCT QUICK VIEW ─────────────────────────────────── */
function openProduct(id) {
  const p = getProduct(id);
  if (!p) return;
  const isMultiImg = p.images && p.images.length > 1;
  const imgHtml = isMultiImg
    ? `<img src="${getImgUrl(p.images[0], p)}" alt="${esc(p.name)}" class="w-100 h-100" style="object-fit:cover;" onerror="this.src='${getProductPlaceholderSvg(p.name, p.type)}'">`
    : `<img src="${getImgUrl(p.image, p)}" alt="${esc(p.name)}" class="w-100 h-100" style="object-fit:cover;" onerror="this.src='${getProductPlaceholderSvg(p.name, p.type)}'">`;

  $("productModalContent").innerHTML = `
    <div class="col-md-6 modal-prod-img">${imgHtml}</div>
    <div class="col-md-6 modal-prod-copy">
      <span class="prod-kicker">${esc(p.type)} / Exterior</span>
      <h2 id="productModalTitle">${esc(p.name)}</h2>
      <div class="d-flex align-items-baseline gap-2 mb-2">
        <div class="modal-price">${money(p.price)}</div>
        <span class="badge bg-success-subtle text-success border border-success-subtle px-2 py-1" style="font-size:0.75rem; font-weight:700;">
          <i class="bi bi-whatsapp me-1"></i> WhatsApp Order Ready
        </span>
      </div>
      ${p.stock === 0 ? '<span class="badge bg-danger mb-3">Sold Out</span>' : (p.stock < 5 ? `<span class="badge bg-warning text-dark mb-3">Only ${p.stock} remaining!</span>` : '')}
      <p>${esc(p.description)}</p>
      <ul class="detail-pts">${(p.points || []).map(x => `<li><i class="bi bi-check2"></i>${esc(x)}</li>`).join("")}</ul>
      ${p.stock === 0 ? `
      <button class="btn-lime w-100 disabled" disabled style="background:#444;color:#888;cursor:not-allowed;border:none;">Sold Out <i class="bi bi-slash-circle ms-1"></i></button>
      ` : `
      <div class="d-flex flex-column gap-2 mt-3 w-100">
        <button class="btn-whatsapp-order w-100 d-flex align-items-center justify-content-center gap-2" data-modal-wa="${p.id}" style="height: 48px; border-radius: 8px; font-weight: 800; background: #25D366; color: #FFF; border: none; cursor: pointer;">
          <i class="bi bi-whatsapp fs-5"></i>
          <span>Order on WhatsApp · ${money(p.price)}</span>
        </button>
        <div class="d-flex gap-2 w-100">
          <button class="btn-add-cart-secondary flex-grow-1 d-flex align-items-center justify-content-center gap-2" data-modal-add="${p.id}" style="height: 44px; border-radius: 8px; font-weight: 700; background: #f1f5f9; color: #0f172a; border: 1.5px solid #cbd5e1; cursor: pointer;">
            <i class="bi bi-bag"></i>
            <span>Add to cart</span>
          </button>
          <button class="btn-secondary-action d-flex align-items-center justify-content-center px-3" data-modal-share="${p.id}" title="Share Product" style="height: 44px; border-radius: 8px; background: #FFF; border: 1px solid #e2e8f0; cursor: pointer;">
            <i class="bi bi-share text-primary"></i>
          </button>
          <button class="btn-secondary-action d-flex align-items-center justify-content-center px-3" data-modal-view="${p.id}" title="Full Details" style="height: 44px; border-radius: 8px; background: #FFF; border: 1px solid #e2e8f0; cursor: pointer;">
            <i class="bi bi-box-arrow-up-right"></i>
          </button>
        </div>
      </div>
      `}
    </div>`;
  $("productModal").setAttribute("aria-labelledby", "productModalTitle");
  productModal.show();
}

/* ── SEARCH ─────────────────────────────────────────────── */
function closeSearch() {
  $("searchPanel").classList.remove("open");
  $("searchInput").value = "";
  state.search = "";
  $("searchResults").innerHTML = "";
  renderProducts();
}

function renderSearchResults() {
  const q = state.search.trim();
  const container = $("searchResults");
  if (!q) { container.innerHTML = ""; return; }
  const results = products.filter(p => matchesSearch(p, q)).slice(0, 5);
  container.innerHTML = results.length
    ? results.map(p => `<div class="search-result" data-search-id="${p.id}" role="option">
        <span>${esc(p.name)}</span><strong>${money(p.price)}</strong></div>`).join("")
    : `<div class="search-result" role="status">No matching product</div>`;
}

function updateHeaderHeight() {
  const ann = document.querySelector(".ann-bar");
  const nav = $("mainNav");
  const h   = (ann?.offsetHeight || 0) + (nav?.offsetHeight || 0);
  document.documentElement.style.setProperty("--header-height", `${h}px`);
}

function updateActiveNav() {
  const links = document.querySelectorAll("#navMenu .nav-link");
  const pos   = window.scrollY + 130;
  let current = "home";
  document.querySelectorAll("main > section[id]").forEach(s => {
    if (s.offsetTop <= pos) current = s.id;
  });
  if (current === "heroSection") current = "home";
  links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${current}`));
  document.querySelectorAll(".drawer-link").forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${current}`));
}

/* ── REVEAL OBSERVER ────────────────────────────────────── */
function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    els.forEach(el => el.classList.add("visible"));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: "0px 0px -36px 0px" });
  els.forEach(el => io.observe(el));
}

/* ── EVENTS ─────────────────────────────────────────────── */
document.addEventListener("click", e => {
  const add = e.target.closest("[data-add]");
  if (add) { addToCart(add.dataset.add); return; }

  const cardWa = e.target.closest("[data-card-wa]");
  if (cardWa) {
    const id = Number(cardWa.dataset.cardWa);
    const existing = state.cart.find(it => String(it.id) === String(id));
    if (!existing) state.cart.push({ id, qty: 1 });
    saveCart();
    renderCart();
    openCheckout();
    return;
  }

  const waOrder = e.target.closest("[data-wa-order]");
  if (waOrder) {
    const id = Number(waOrder.dataset.waOrder);
    const existing = state.cart.find(it => String(it.id) === String(id));
    if (!existing) state.cart.push({ id, qty: 1 });
    saveCart();
    renderCart();
    openCheckout();
    return;
  }

  const shareBtn = e.target.closest("[data-share], [data-card-share]");
  if (shareBtn) {
    const id = shareBtn.dataset.share || shareBtn.dataset.cardShare;
    const p = getProduct(id);
    if (p) {
      const text = buildProductShareText(p);
      shareToWhatsApp(text);
      showToast(`Sharing ${p.name}...`);
    }
    return;
  }

  const modalWa = e.target.closest("[data-modal-wa]");
  if (modalWa) {
    const id = Number(modalWa.dataset.modalWa);
    const existing = state.cart.find(it => String(it.id) === String(id));
    if (!existing) state.cart.push({ id, qty: 1 });
    saveCart();
    renderCart();
    productModal.hide();
    openCheckout();
    return;
  }

  const modalShare = e.target.closest("[data-modal-share]");
  if (modalShare) {
    const p = getProduct(modalShare.dataset.modalShare);
    if (p) {
      const text = buildProductShareText(p);
      shareToWhatsApp(text);
      showToast(`Sharing ${p.name}...`);
    }
    return;
  }

  const modalView = e.target.closest("[data-modal-view]");
  if (modalView) {
    productModal.hide();
    navigate(`/product/${modalView.dataset.modalView}`);
    return;
  }

  const bundleWa = e.target.closest(".bundleWaBtn, [data-bundle-wa]");
  if (bundleWa) {
    const id = Number(bundleWa.dataset.kitId || bundleWa.dataset.bundleWa);
    const existing = state.cart.find(it => String(it.id) === String(id));
    if (!existing) state.cart.push({ id, qty: 1 });
    saveCart();
    renderCart();
    openCheckout();
    return;
  }

  const view = e.target.closest("[data-view]");
  if (view) { navigate(`/product/${view.dataset.view}`); return; }

  const moreKits = e.target.closest(".see-more-kits, #seeMoreKitsBtn");
  if (moreKits) {
    document.querySelectorAll(".f-pill").forEach(x => {
      const isKit = x.dataset.filter === "kit";
      x.classList.toggle("active", isKit);
      x.setAttribute("aria-pressed", isKit ? "true" : "false");
    });
    state.filter = "kit";
    renderProducts();
    const shop = document.getElementById("shop");
    if (shop) shop.scrollIntoView({ behavior: "smooth" });
    return;
  }

  const prodCard = e.target.closest(".product-card");
  if (prodCard && !e.target.closest("button") && !e.target.closest("a")) {
    const imgEl = prodCard.querySelector(".prod-img");
    const id = imgEl?.dataset?.id;
    if (id) { navigate(`/product/${id}`); return; }
  }

  const modalAdd = e.target.closest("[data-modal-add]");
  if (modalAdd) { addToCart(modalAdd.dataset.modalAdd); productModal.hide(); cartDrawer.show(); return; }

  const qty = e.target.closest("[data-qty]");
  if (qty) {
    const id   = qty.dataset.qty;
    const item = state.cart.find(i => String(i.id) === String(id));
    if (!item) return;
    const p = getProduct(id);
    const delta = Number(qty.dataset.delta);
    if (delta > 0 && item.qty >= p.stock) {
      showToast(`Only ${p.stock} units of ${p.name} are available`, true);
      return;
    }
    item.qty += delta;
    if (item.qty <= 0) state.cart = state.cart.filter(i => String(i.id) !== String(id));
    saveCart(); renderCart(); return;
  }

  const rem = e.target.closest("[data-remove]");
  if (rem) {
    state.cart = state.cart.filter(i => String(i.id) !== String(rem.dataset.remove));
    saveCart(); renderCart();
  }
});

const filterPills = $("filterPills");
if (filterPills) {
  filterPills.addEventListener("click", (e) => {
    const btn = e.target.closest(".f-pill");
    if (!btn) return;
    document.querySelectorAll(".f-pill").forEach(x => { x.classList.remove("active"); x.setAttribute("aria-pressed", "false"); });
    btn.classList.add("active");
    btn.setAttribute("aria-pressed", "true");
    state.filter = btn.dataset.filter;
    renderProducts();
  });
}

$("sortSelect")?.addEventListener("change", e => { state.sort = e.target.value; renderProducts(); });
$("cartToggle")?.addEventListener("click", () => cartDrawer.show());
$("checkoutBtn")?.addEventListener("click", openCheckout);
$("checkoutForm")?.addEventListener("submit", placeOrder);
document.addEventListener("click", function(e) {
  const bundleBtn = e.target.closest(".bundleBtn");
  if (bundleBtn) {
    const kitId = bundleBtn.dataset.kitId;
    if (kitId) addToCart(kitId, true);
  }
});

$("searchToggle")?.addEventListener("click", () => {
  $("searchPanel")?.classList.add("open");
  updateHeaderHeight();
  $("searchInput")?.focus();
});
$("searchClose")?.addEventListener("click", closeSearch);
$("searchInput")?.addEventListener("input", () => {
  const inputEl = $("searchInput");
  if (!inputEl) return;
  state.search = inputEl.value.trim();
  renderProducts();
  renderSearchResults();
});
$("searchResults")?.addEventListener("click", e => {
  const r = e.target.closest("[data-search-id]");
  if (!r) return;
  navigate(`/product/${r.dataset.searchId}`);
  closeSearch();
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && $("searchPanel")?.classList.contains("open")) closeSearch();
});

document.querySelectorAll("#navMenu .nav-link").forEach(a => {
  a.addEventListener("click", () => navCollapse.hide());
});

document.querySelectorAll(".socials a").forEach(a => {
  a.addEventListener("click", e => { e.preventDefault(); showToast("Social profiles coming soon."); });
});

$("backToTop")?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
$("notifyBtn")?.addEventListener("click", () => notifyModal.show());
$("footerNotify")?.addEventListener("click", () => notifyModal.show());

$("notifyForm")?.addEventListener("submit", async e => {
  e.preventDefault();
  const input = e.target.querySelector("input[type=email]");
  const ok = await subscribe(input.value.trim(), "notify", $("notifySubmit"));
  if (ok) { notifyModal.hide(); e.target.reset(); }
});

$("newsletterForm")?.addEventListener("submit", async e => {
  e.preventDefault();
  const input = $("emailInput");
  if (input) {
    if (!input.checkValidity()) { input.reportValidity(); return; }
    const ok = await subscribe(input.value.trim(), "newsletter", $("newsletterBtn"));
    if (ok) e.target.reset();
  }
});

let scrollTicking = false;
window.addEventListener("scroll", () => {
  if (!scrollTicking) {
    requestAnimationFrame(() => {
      const sy = window.scrollY;
      $("mainNav")?.classList.toggle("scrolled", sy > 20);
      $("backToTop")?.classList.toggle("show", sy > 700);
      updateActiveNav();
      scrollTicking = false;
    });
    scrollTicking = true;
  }
}, { passive: true });

let resizeTimer = null;
window.addEventListener("resize", () => {
  if (resizeTimer) clearTimeout(resizeTimer);
  resizeTimer = setTimeout(updateHeaderHeight, 100);
}, { passive: true });

updateHeaderHeight();  /* sync --header-height at boot so navbar + hero = exactly one screen */
window.addEventListener("load", updateHeaderHeight, { passive: true });
if (document.fonts && document.fonts.ready) {
  /* re-measure once webfonts settle, then let the hero canvas re-fit */
  document.fonts.ready.then(() => { updateHeaderHeight(); window.dispatchEvent(new Event("resize")); });
}

$("retryProducts")?.addEventListener("click", () => loadProducts());

/* ══════════════════════════════════════════════════════════
   3D SCROLL HERO (Three.js r128)
   ══════════════════════════════════════════════════════════ */

function showHeroFallback(section) {
  section.classList.add("no-3d");
  $("heroFallback")?.classList.remove("d-none");
  $("heroCanvas")?.classList.add("d-none");
}

/* Procedural studio environment — light strips for PBR reflections */
function makeStudioEnv(renderer) {
  const size = 64;
  const faces = [];
  for (let i = 0; i < 6; i++) {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const g = c.getContext("2d");
    const grad = g.createLinearGradient(0, 0, 0, size);
    grad.addColorStop(0, i === 2 ? "#46586c" : "#131c26");
    grad.addColorStop(0.55, "#0a1016");
    grad.addColorStop(1, "#04070a");
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);
    g.fillStyle = "rgba(200,245,60,0.85)";  /* lime strip light */
    g.fillRect(0, Math.round(size * 0.40), size, 3);
    g.fillStyle = "rgba(120,170,255,0.55)"; /* cool strip light */
    g.fillRect(0, Math.round(size * 0.62), size, 2);
    faces.push(c);
  }
  const cube = new THREE.CubeTexture(faces);
  cube.needsUpdate = true;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromCubemap(cube).texture;
  pmrem.dispose();
  return env;
}

async function getCachedGLB(url) {
  try {
    const cache = await caches.open("neatify-assets-cache");
    let cachedResponse = await cache.match(url);
    if (!cachedResponse) {
      console.log("GLB not in cache, fetching and caching...");
      await cache.add(url);
      cachedResponse = await cache.match(url);
    } else {
      console.log("GLB served from browser CacheStorage!");
    }
    const blob = await cachedResponse.blob();
    return URL.createObjectURL(blob);
  } catch (err) {
    console.error("Cache API failed, returning original URL", err);
    return url;
  }
}

function initHero3D() {
  const section = $("heroSection");
  const canvas  = $("heroCanvas");
  const sticky  = section && section.querySelector(".hero-sticky");
  if (!section || !canvas) return;

  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (typeof THREE === "undefined") {
    showHeroFallback(section);
    return;
  }

  /* Renderer */
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch { showHeroFallback(section); return; }

  const isMobile = () => typeof window !== "undefined" && window.innerWidth < 992;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile() ? 1.25 : 1.75));
  if (typeof THREE.sRGBEncoding !== "undefined") renderer.outputEncoding = THREE.sRGBEncoding;
  if (typeof THREE.ACESFilmicToneMapping !== "undefined") {
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
  }
  renderer.shadowMap.enabled = false;

  /* ── Scene & Camera ── */
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 7);

  /* ── Lighting — warm key + cool fill + white rim ── */
  scene.add(new THREE.AmbientLight(0xffffff, 1.0));

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
  keyLight.position.set(3, 5, 5);
  scene.add(keyLight);

  const limeSpot = new THREE.PointLight(0xc8f53c, 1.2, 40);
  limeSpot.position.set(-3, 2, 4);
  scene.add(limeSpot);

  const blueRim = new THREE.PointLight(0x4488ff, 0.8, 40);
  blueRim.position.set(4, -1, 3);
  scene.add(blueRim);

  const backRim = new THREE.PointLight(0xffffff, 0.5, 40);
  backRim.position.set(0, 3, -6);
  scene.add(backRim);

  /* ── Studio reflections for PBR materials ── */
  try { scene.environment = makeStudioEnv(renderer); } catch { /* optional */ }

  /* ── Product group ── */
  const productGroup = new THREE.Group();
  scene.add(productGroup);
  let modelHolder  = null;
  let modelScale   = 1;
  let introEase    = 0;

  /* ── Loader UI ── */
  const loaderEl  = $("modelLoader");
  const loaderTxt = $("modelLoaderText");
  if (loaderEl) loaderEl.classList.remove("d-none");

  /* ── Load GLB (3dimage — draco-compressed, webp textures) ── */
  if (THREE.GLTFLoader) {
    const dracoLoader = new THREE.DRACOLoader();
    dracoLoader.setDecoderPath("https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/libs/draco/gltf/");
    dracoLoader.preload();
    const gltfLoader = new THREE.GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);
    const tryLoad = async (attempt) => {
      let modelUrl = "assets/3dimage.glb";
      try {
        modelUrl = await getCachedGLB("assets/3dimage.glb");
      } catch (e) {
        console.warn("GLB cache check failed:", e);
      }
      gltfLoader.load(
        modelUrl,
        (gltf) => {
          const model = gltf.scene;

          /* Material polish + guards for any exporter output */
          model.traverse(child => {
            if (!child.isMesh) return;
            child.castShadow = false;
            child.receiveShadow = false;
            child.frustumCulled = false;  /* spinning model never pops */
            const mats = Array.isArray(child.material) ? child.material : [child.material];
            mats.forEach((m) => {
              if (!m) return;
              m.transparent = false;
              m.depthWrite = true;
              if ("envMapIntensity" in m) m.envMapIntensity = 1;
              if (m.map) m.map.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
              m.needsUpdate = true;
            });
          });

          /* Auto-fit: centre on bounding box, scale tallest edge → 2.6 units */
          const box  = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const ctr  = box.getCenter(new THREE.Vector3());
          if (Number.isFinite(size.x + size.y + size.z) && size.x + size.y + size.z > 0) {
            model.position.sub(ctr);
            const maxDim = Math.max(size.x, size.y, size.z);
            modelScale = maxDim > 0 ? 2.6 / maxDim : 1;
          }

          modelHolder = new THREE.Group();
          modelHolder.add(model);
          modelHolder.scale.setScalar(0.001);  /* start tiny, eases in */
          productGroup.add(modelHolder);

          if (loaderEl) loaderEl.classList.add("d-none");
        },
        (xhr) => {
          if (loaderEl && loaderTxt) {
            loaderTxt.textContent = xhr.total > 0
              ? `Loading 3D… ${Math.round(xhr.loaded / xhr.total * 100)}%`
              : `Loading 3D… ${(xhr.loaded / 1048576).toFixed(1)} MB`;
          }
        },
        (err) => {
          console.warn(`3D model attempt ${attempt} failed:`, err);
          if (attempt < 3) { setTimeout(() => tryLoad(attempt + 1), 900 * attempt); return; }
          /* Retries spent — keep the live canvas (rings + particles) so the
             hero still breathes instead of collapsing to the flat photo */
          if (loaderEl) loaderEl.classList.add("d-none");
        }
      );
    };
    tryLoad(1);
  } else {
    if (loaderEl) loaderEl.classList.add("d-none");
    showHeroFallback(section);
  }

  /* ── Orbiting ring — lime halo that truly wraps the bottle ── */
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.6, 0.03, 16, isMobile() ? 48 : 96),
    new THREE.MeshBasicMaterial({
      color: 0xc8f53c,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  ring.rotation.x = Math.PI * 0.45;
  scene.add(ring);

  /* ── Tiny accent ring (counter-rotating) ── */
  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(1.1, 0.018, 12, isMobile() ? 36 : 64),
    new THREE.MeshBasicMaterial({
      color: 0x4488ff,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  ring2.rotation.x = Math.PI * 0.3;
  ring2.rotation.z = Math.PI * 0.25;
  scene.add(ring2);

  /* ── Bubble particle field (optimized for mobile) ── */
  const PARTS = isMobile() ? 45 : 120;
  const pPos  = new Float32Array(PARTS * 3);
  const pSpd  = new Float32Array(PARTS);
  for (let i = 0; i < PARTS; i++) {
    pPos[i * 3]     = (Math.random() - 0.5) * 12;
    pPos[i * 3 + 1] = (Math.random() - 0.5) * 9;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;
    pSpd[i] = 0.08 + Math.random() * 0.3;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({
    color: 0xc8f53c, size: 0.05, transparent: true, opacity: 0.32, sizeAttenuation: true,
  })));

  /* Scroll */
  const space    = section.querySelector(".hero-scroll-space");
  const stages   = [...document.querySelectorAll(".hero-stage")];
  const railDots  = [...document.querySelectorAll(".rail-dash")];
  const cueEl    = $("scrollCue");
  const statusEl = $("heroStatus");

  let scrollTarget  = 0;
  let scrollCurrent = 0;
  let activeStage   = -1;
  let rafId         = null;
  let heroVisible   = true;
  let spaceTop      = 0;
  let spaceTotal    = 1;
  const clock       = new THREE.Clock();

  const smoothstep = (x, a, b) => {
    const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };

  function setSize() {
    const w = section.clientWidth;
    const h = (sticky && sticky.clientHeight) || window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  function measureSpace() {
    if (!space) return;
    const rect = space.getBoundingClientRect();
    spaceTop = rect.top + window.scrollY;
    const stickyH = (sticky && sticky.clientHeight) || window.innerHeight;
    spaceTotal = Math.max(1, space.offsetHeight - stickyH);
  }

  function readScroll() {
    if (!space) return;
    const sy = window.scrollY;
    const offset = sy - spaceTop;
    scrollTarget = Math.min(1, Math.max(0, offset / spaceTotal));
  }

  function setStage(index) {
    if (index === activeStage) return;
    activeStage = index;
    stages.forEach((s, i) => s.classList.toggle("active", i === index));
    railDots.forEach((d, i) => d.classList.toggle("active", i === index));
    if (statusEl) statusEl.textContent = `Stage ${index + 1} of ${railDots.length}`;
  }

  function animate() {
    if (!heroVisible) {
      rafId = null;
      return;
    }
    rafId = requestAnimationFrame(animate);

    if (!REDUCED) scrollCurrent += (scrollTarget - scrollCurrent) * 0.045;
    const p  = REDUCED ? 0 : scrollCurrent;
    const t  = REDUCED ? 0 : clock.getElapsedTime();
    const mb = isMobile();

    /* ── Model: scroll is the controller; idle adds life ── */
    const idleY  = Math.sin(t * 0.6) * 0.12;
    const idleRZ = Math.sin(t * 0.4) * 0.04;
    productGroup.rotation.y  = p * Math.PI * 3 + Math.sin(t * 0.5) * 0.06;
    productGroup.rotation.z  = idleRZ + Math.sin(p * Math.PI) * 0.05;
    productGroup.position.y  = idleY + p * 0.3;

    const blend = smoothstep(p, 0.6, 1.0);
    if (mb) {
      /* Mobile: Perfectly proportioned compact bottle floating in upper section */
      productGroup.position.x = 0;
      productGroup.position.y = 1.15 + idleY * 0.4 + p * 0.15;
      productGroup.scale.setScalar(0.70);
    } else {
      const wideBias = Math.min(0.8, Math.max(0, camera.aspect - 1.45) * 1.4);
      productGroup.position.x = (3.3 + wideBias) * (1 - blend);
      productGroup.scale.setScalar(1);
    }

    /* ── Soft scale-in on load ── */
    if (modelHolder) {
      introEase = REDUCED ? 1 : Math.min(1, introEase + (1 - introEase) * 0.055);
      modelHolder.scale.setScalar(modelScale * Math.max(introEase, 0.0001));
    }

    /* ── Rings orbit productGroup ── */
    ring.position.copy(productGroup.position);
    ring.scale.setScalar(mb ? 0.70 : 1);
    ring.rotation.y  = t * 0.5 + p * Math.PI * 2;
    ring.rotation.x  = Math.PI * 0.45 + Math.sin(t * 0.3) * 0.06;

    ring2.position.copy(productGroup.position);
    ring2.scale.setScalar(mb ? 0.70 : 1);
    ring2.rotation.y = -t * 0.7 - p * Math.PI * 2.5;
    ring2.rotation.z = Math.PI * 0.25 + t * 0.2;

    /* ── Camera ── */
    if (mb) {
      camera.position.set(0, 0.85, 6.2);
      camera.lookAt(0, 0.85, 0);
    } else {
      const camX = -1.2 + blend * 1.2;
      const camZ = 6.5 - Math.sin(p * Math.PI) * 0.5;
      camera.position.set(camX, 0.5 + idleY * 0.3, camZ);
      camera.lookAt(productGroup.position.x * 0.45, 0.5, 0);
    }

    /* ── Key light orbits model ── */
    limeSpot.position.set(
      productGroup.position.x + Math.cos(t * 0.7) * 3.5,
      2 + Math.sin(t * 0.4) * 1.5,
      3 + Math.sin(t * 0.7) * 2
    );
    blueRim.position.set(
      productGroup.position.x - Math.cos(t * 0.5) * 3,
      -1 + Math.sin(t * 0.3),
      4
    );

    /* ── Bubble particles drift upward ── */
    if (!REDUCED) {
      const pos = pGeo.attributes.position.array;
      for (let i = 0; i < PARTS; i++) {
        pos[i * 3 + 1] += pSpd[i] * 0.014;
        if (pos[i * 3 + 1] > 5) pos[i * 3 + 1] = -5;
      }
      pGeo.attributes.position.needsUpdate = true;
    }

    /* ── UI sync ── */
    if (cueEl) cueEl.classList.toggle("hide", p > 0.02);
    setStage(p < 0.35 ? 0 : p < 0.7 ? 1 : 2);

    renderer.render(scene, camera);
  }

  const start = () => {
    if (rafId === null && heroVisible) {
      measureSpace();
      readScroll();
      rafId = requestAnimationFrame(animate);
    }
  };
  const stop  = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  new IntersectionObserver(([entry]) => {
    heroVisible = entry.isIntersecting;
    if (heroVisible) {
      start();
    } else {
      stop();
    }
  }, { threshold: 0.05 }).observe(section);

  measureSpace();
  readScroll();

  window.addEventListener("scroll", () => {
    if (heroVisible) readScroll();
  }, { passive: true });

  window.addEventListener("resize", () => {
    measureSpace();
    setSize();
    readScroll();
  }, { passive: true });

  // Interactive rail click navigation
  railDots.forEach((dash, i) => {
    dash.style.cursor = "pointer";
    dash.addEventListener("click", () => {
      if (!space) return;
      measureSpace();
      const targetProgress = i / Math.max(1, railDots.length - 1);
      const targetScrollY = spaceTop + spaceTotal * targetProgress;
      window.scrollTo({ top: targetScrollY, behavior: "smooth" });
    });
  });

  $("heroKitBtn")?.addEventListener("click", () => addBundle(settings.weekendKitIds || []));

  setSize();
  readScroll();
  start();
}

/* ── MATERIAL RIPPLE ───────────────────────────────────── */
function initRipple() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.addEventListener("pointerdown", (e) => {
    const t = e.target.closest("button, .btn-hero-primary, .btn-hero-ghost, .btn-primary-sm, .f-pill, .nav-link, .socials a");
    if (!t || t.disabled) return;
    const r = t.getBoundingClientRect();
    const d = Math.max(r.width, r.height) * 1.2;
    const s = document.createElement("span");
    s.className = "ripple-ink";
    s.style.width = s.style.height = d + "px";
    s.style.left = e.clientX - r.left - d / 2 + "px";
    s.style.top  = e.clientY - r.top - d / 2 + "px";
    t.appendChild(s);
    setTimeout(() => s.remove(), 600);
  });
}

/* ── MOBILE DRAWER ─────────────────────────────────────── */
function initDrawer() {
  const drawer = $("navDrawer");
  const scrim  = $("navScrim");
  const burger = $("navBurger");
  if (!drawer || !scrim || !burger) return;
  const open = () => {
    drawer.classList.add("open");
    scrim.classList.add("show");
    drawer.setAttribute("aria-hidden", "false");
    burger.setAttribute("aria-expanded", "true");
    document.body.classList.add("no-scroll");
  };
  const close = () => {
    drawer.classList.remove("open");
    scrim.classList.remove("show");
    drawer.setAttribute("aria-hidden", "true");
    burger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  };
  burger.addEventListener("click", () => (drawer.classList.contains("open") ? close() : open()));
  $("navDrawerClose")?.addEventListener("click", close);
  scrim.addEventListener("click", close);
  drawer.querySelectorAll("a").forEach(a => a.addEventListener("click", close));
  window.addEventListener("resize", () => { if (innerWidth >= 992) close(); });
}

/* ── ANNOUNCE POPUP ─────────────────────────────────────── */
function initAnnouncePop() {
  const pop = $("annPop");
  if (!pop) return;
  if (localStorage.getItem("neatify-ann-dismissed")) return;
  setTimeout(() => pop.classList.add("show"), 1200);
  $("annPopClose")?.addEventListener("click", () => {
    pop.classList.remove("show");
    localStorage.setItem("neatify-ann-dismissed", "1");
  });
}

/* ── BOOT ──────────────────────────────────────────────── */
async function boot() {
  if (location.protocol === "file:") {
    showToast("Open via http://localhost:3000 (npm start).", true);
  }
  const step = fn => Promise.resolve().then(fn).catch(err => console.warn("Boot step failed:", err));
  await step(updateHeaderHeight);
  await step(initDrawer);
  await step(initAnnouncePop);
  await step(initAccount);
  await step(initRipple);
  await step(initReveal);
  await step(initHero3D);
  await step(loadSettings);
  await step(loadCategories);
  await step(loadProducts);
  await step(loadCart);
  await step(renderCart);
  await step(updateActiveNav);
  await step(() => {
    if (window.location.hash) {
      setTimeout(() => {
        try {
          const target = document.querySelector(window.location.hash);
          if (target) target.scrollIntoView({ behavior: "smooth" });
        } catch {}
      }, 200);
    }
  });
}


    // --- END VANILLA LOGIC ---

    let cleanup = null;
    const timerId = setTimeout(() => {
      if (typeof boot === 'function') {
        cleanup = boot();
      }
    }, 100);

    return () => {
      clearTimeout(timerId);
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, []);
}
