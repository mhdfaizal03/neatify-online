import { useEffect } from 'react';

export function useStorefrontLogic() {
  useEffect(() => {
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

const getProduct = (id) => products.find((p) => p.id === id);

const matchesSearch = (p, q) => {
  if (!q) return true;
  return `${p.name} ${p.type} ${p.category} ${p.description}`.toLowerCase().includes(q.toLowerCase());
};

function esc(str) {
  const d = document.createElement("div");
  d.textContent = str == null ? "" : String(str);
  return d.innerHTML;
}

async function api(path, opts = {}) {
  const headers = { "Content-Type": "application/json", ...(opts.headers || {}) };
  if (session.token && !headers.Authorization) headers.Authorization = `Bearer ${session.token}`;
  const res = await fetch(path, { ...opts, headers });
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
  grid.innerHTML = `<div class="col-12"><div class="grid-loading"><div class="spin-ring"></div><span>Loading products…</span></div></div>`;
  try {
    products = await api("/api/products");
  } catch {
    if (attempt < 3) {
      await new Promise(r => setTimeout(r, 600 * attempt));
      return loadProducts(attempt + 1);
    }
    grid.innerHTML = "";
    $("emptyState").classList.remove("d-none");
    $("emptyStateTitle").textContent = "Couldn't load products";
    $("emptyStateText").textContent = "Make sure the server is running (npm start) and open http://localhost:3000.";
    $("retryProducts").classList.remove("d-none");
    showToast("Could not load products. Please refresh.", true);
    return;
  }
  $("retryProducts").classList.add("d-none");
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
  const ids = Array.isArray(settings.weekendKitIds) ? settings.weekendKitIds : [];
  const kits = ids.map(getProduct).filter(Boolean);
  const total = kits.reduce((s, p) => s + p.price, 0);
  const bp = $("bundlePrice");
  if (bp) bp.textContent = kits.length ? `${kits.length} items · ${money(total)}` : "";
  const h = getProduct(settings.highlightProductId);
  const bi = $("bundleImage");
  if (h && bi) bi.src = h.image;
}

function filteredProducts() {
  let list = products.filter(p => state.filter === "all" || p.category === state.filter);
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
  empty.classList.toggle("d-none", list.length !== 0);
  if (!list.length) {
    $("emptyStateTitle").textContent = "No products found";
    $("emptyStateText").textContent = "Try another search or category.";
    grid.innerHTML = "";
    return;
  }
  grid.innerHTML = list.map(p => `
    <div class="col-6 col-lg-4 col-xl-3">
      <article class="product-card">
        <div class="prod-img" data-id="${p.id}" role="button" tabindex="0" aria-label="View ${esc(p.name)}">
          <span class="prod-badge${p.id === settings.highlightProductId ? " lime" : ""}">${esc(p.badge)}</span>
          <button class="prod-quick" data-view="${p.id}" aria-label="Quick view ${esc(p.name)}">
            <i class="bi bi-eye"></i>
          </button>
          <img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy">
        </div>
        <div class="prod-body">
          <span class="prod-kicker">${esc(p.type)} / Exterior</span>
          <h3>${esc(p.name)}</h3>
          <p>${esc(p.description)}</p>
          <div class="prod-foot">
            <span class="prod-price">${money(p.price)}</span>
            <button class="add-btn" data-add="${p.id}" aria-label="Add ${esc(p.name)} to cart">
              <i class="bi bi-plus-lg"></i>
            </button>
          </div>
        </div>
      </article>
    </div>`).join("");
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
  const found = state.cart.find(i => i.id === id);
  if (found) found.qty++;
  else state.cart.push({ id, qty: 1 });
  saveCart();
  renderCart();
  bumpBadge();
  showToast(`${p.name} added`);
  if (openDrawer) cartDrawer.show();
}

function addBundle(ids) {
  const added = ids.map(getProduct).filter(Boolean);
  if (!added.length) return;
  added.forEach(p => {
    const found = state.cart.find(i => i.id === p.id);
    if (found) found.qty++;
    else state.cart.push({ id: p.id, qty: 1 });
  });
  saveCart();
  renderCart();
  bumpBadge();
  showToast("Weekend kit added to cart");
  cartDrawer.show();
}

function bumpBadge() {
  const badge = $("cartCount");
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
      <img src="${esc(p.image)}" alt="${esc(p.name)}">
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
  $("cartSubtotal").textContent = money(sub);
  $("cartShipping").textContent = ship === 0 ? "FREE" : money(ship);
  $("cartTotal").textContent    = money(sub + ship);
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

/* ── CHECKOUT ───────────────────────────────────────────── */
function openCheckout() {
  if (!state.cart.length) return;
  if (!isLoggedIn()) {
    /* Purchases require an account — route through auth, then resume */
    pendingCheckout = true;
    cartDrawer.hide();
    showAuthNotice(true);
    authSwitch("login");
    authModal.show();
    return;
  }
  prefillCheckout();
  renderCheckoutSummary();
  cartDrawer.hide();
  checkoutModal.show();
}

/* Returning customers never re-type what we already know */
function prefillCheckout() {
  const u = session.user || {};
  if (!$("coName").value.trim())    $("coName").value    = u.name || "";
  if (!$("coPhone").value.trim())   $("coPhone").value   = u.phone || "";
  if (!$("coEmail").value.trim())   $("coEmail").value   = u.email || "";
  if (!$("coAddress").value.trim()) $("coAddress").value = u.address || "";
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
  $("checkoutItems").innerHTML = items;
  const sub  = subtotalValue();
  const ship = shippingFor(sub);
  $("coSubtotal").textContent = money(sub);
  $("coShipping").textContent = ship === 0 ? "FREE" : money(ship);
  $("coTotal").textContent    = money(sub + ship);
}

function validateCheckout() {
  let valid = true;
  const rules = [
    { id: "coName",    err: "coNameError",    test: v => v.length >= 2,                      msg: "Enter your name" },
    { id: "coPhone",   err: "coPhoneError",   test: v => /^[+\d][\d\s\-()]{7,14}$/.test(v), msg: "Enter a valid phone" },
    { id: "coEmail",   err: "coEmailError",   test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: "Enter a valid email" },
    { id: "coAddress", err: "coAddressError", test: v => v.length >= 10,                     msg: "Enter a full address" },
  ];
  rules.forEach(rule => {
    const input = $(rule.id);
    const errEl = $(rule.err);
    const ok    = rule.test(input.value.trim());
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
  btn.disabled = true;
  btn.innerHTML = `<span class="loader-spin" style="width:14px;height:14px;border-width:1.5px;margin-right:0.4rem;"></span>Placing…`;

  const sub  = subtotalValue();
  const ship = shippingFor(sub);
  const payload = {
    items: state.cart.map(item => {
      const p = getProduct(item.id);
      return { id: p.id, name: p.name, price: p.price, qty: item.qty };
    }),
    total: sub + ship, shipping: ship,
    customer: {
      name:    $("coName").value.trim(),
      phone:   $("coPhone").value.trim(),
      email:   $("coEmail").value.trim(),
      address: $("coAddress").value.trim(),
      notes:   $("coNotes").value.trim(),
    },
  };
  try {
    const order = await api("/api/orders", { method: "POST", body: JSON.stringify(payload) });
    checkoutModal.hide();
    $("checkoutForm").reset();
    state.cart = [];
    saveCart();
    renderCart();
    $("orderIdChip").textContent = order.id;
    orderSuccModal.show();
  } catch (err) {
    if (/sign in/i.test(err.message)) {
      /* token expired mid-checkout — re-auth then resume */
      clearSession();
      pendingCheckout = true;
      checkoutModal.hide();
      showAuthNotice(true);
      authModal.show();
    }
    showToast(err.message || "Could not place order. Try again.", true);
  } finally {
    btn.disabled = false;
    btn.innerHTML = `Place order <i class="bi bi-check2-circle"></i>`;
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
  $("authTabLogin").classList.toggle("active", tab === "login");
  $("authTabRegister").classList.toggle("active", tab === "register");
  $("loginForm").classList.toggle("d-none", tab !== "login");
  $("registerForm").classList.toggle("d-none", tab !== "register");
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
        <span class="acc-status ${esc(status)}">${esc(status)}</span>
      </div>
      <div class="acc-order-items">${lines}</div>
      <div class="acc-order-total"><span>Total</span><strong>${money(o.total || 0)}</strong></div>
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

  $("accountBtn").addEventListener("click", () => {
    if (isLoggedIn()) { openAccount(); return; }
    showAuthNotice(false);
    authSwitch("login");
    authModal.show();
  });

  $("authTabLogin").addEventListener("click", () => authSwitch("login"));
  $("authTabRegister").addEventListener("click", () => authSwitch("register"));
  document.querySelectorAll(".pw-eye").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = $(btn.dataset.eye);
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.querySelector("i").className = show ? "bi bi-eye-slash" : "bi bi-eye";
    });
  });

  $("loginForm").addEventListener("submit", (e) => handleAuth(e, "login"));
  $("registerForm").addEventListener("submit", (e) => handleAuth(e, "register"));

  document.querySelectorAll(".acc-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".acc-tab").forEach((t) => t.classList.toggle("active", t === tab));
      document.querySelectorAll(".acc-pane").forEach((p) => p.classList.remove("active"));
      $(`accPane${tab.dataset.acc.charAt(0).toUpperCase()}${tab.dataset.acc.slice(1)}`).classList.add("active");
      if (tab.dataset.acc === "orders") loadAccountOrders();
    });
  });

  $("profileForm").addEventListener("submit", saveProfile);
  $("passwordForm").addEventListener("submit", savePassword);
  $("logoutBtn").addEventListener("click", () => {
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
  $("productModalContent").innerHTML = `
    <div class="col-md-6 modal-prod-img"><img src="${esc(p.image)}" alt="${esc(p.name)}"></div>
    <div class="col-md-6 modal-prod-copy">
      <span class="prod-kicker">${esc(p.type)} / Exterior</span>
      <h2 id="productModalTitle">${esc(p.name)}</h2>
      <div class="modal-price">${money(p.price)}</div>
      <p>${esc(p.description)}</p>
      <ul class="detail-pts">${(p.points || []).map(x => `<li><i class="bi bi-check2"></i>${esc(x)}</li>`).join("")}</ul>
      <button class="btn-lime w-100" data-modal-add="${p.id}">Add to cart <i class="bi bi-bag ms-1"></i></button>
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
  if (add) { addToCart(Number(add.dataset.add)); return; }

  const view = e.target.closest("[data-view]");
  if (view) { openProduct(Number(view.dataset.view)); return; }

  const prodImg = e.target.closest(".prod-img");
  if (prodImg && !e.target.closest("button")) { openProduct(Number(prodImg.dataset.id)); return; }

  const modalAdd = e.target.closest("[data-modal-add]");
  if (modalAdd) { addToCart(Number(modalAdd.dataset.modalAdd)); productModal.hide(); cartDrawer.show(); return; }

  const qty = e.target.closest("[data-qty]");
  if (qty) {
    const id   = Number(qty.dataset.qty);
    const item = state.cart.find(i => i.id === id);
    if (!item) return;
    item.qty += Number(qty.dataset.delta);
    if (item.qty <= 0) state.cart = state.cart.filter(i => i.id !== id);
    saveCart(); renderCart(); return;
  }

  const rem = e.target.closest("[data-remove]");
  if (rem) {
    state.cart = state.cart.filter(i => i.id !== Number(rem.dataset.remove));
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

$("sortSelect").addEventListener("change", e => { state.sort = e.target.value; renderProducts(); });
$("cartToggle").addEventListener("click", () => cartDrawer.show());
$("checkoutBtn").addEventListener("click", openCheckout);
$("checkoutForm").addEventListener("submit", placeOrder);
$("bundleBtn").addEventListener("click", () => addBundle(settings.weekendKitIds || []));

$("searchToggle").addEventListener("click", () => {
  $("searchPanel").classList.add("open");
  updateHeaderHeight();
  $("searchInput").focus();
});
$("searchClose").addEventListener("click", closeSearch);
$("searchInput").addEventListener("input", () => {
  state.search = $("searchInput").value.trim();
  renderProducts();
  renderSearchResults();
});
$("searchResults").addEventListener("click", e => {
  const r = e.target.closest("[data-search-id]");
  if (!r) return;
  openProduct(Number(r.dataset.searchId));
  closeSearch();
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && $("searchPanel").classList.contains("open")) closeSearch();
});

document.querySelectorAll("#navMenu .nav-link").forEach(a => {
  a.addEventListener("click", () => navCollapse.hide());
});

document.querySelectorAll(".socials a").forEach(a => {
  a.addEventListener("click", e => { e.preventDefault(); showToast("Social profiles coming soon."); });
});

$("backToTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
$("notifyBtn").addEventListener("click", () => notifyModal.show());
$("footerNotify").addEventListener("click", () => notifyModal.show());

$("notifyForm").addEventListener("submit", async e => {
  e.preventDefault();
  const input = e.target.querySelector("input[type=email]");
  const ok = await subscribe(input.value.trim(), "notify", $("notifySubmit"));
  if (ok) { notifyModal.hide(); e.target.reset(); }
});

$("newsletterForm").addEventListener("submit", async e => {
  e.preventDefault();
  const input = $("emailInput");
  if (!input.checkValidity()) { input.reportValidity(); return; }
  const ok = await subscribe(input.value.trim(), "newsletter", $("newsletterBtn"));
  if (ok) e.target.reset();
});

window.addEventListener("scroll", () => {
  $("mainNav").classList.toggle("scrolled", scrollY > 20);
  $("backToTop").classList.toggle("show", scrollY > 700);
  updateActiveNav();
}, { passive: true });

window.addEventListener("resize", updateHeaderHeight);
updateHeaderHeight();  /* sync --header-height at boot so navbar + hero = exactly one screen */
window.addEventListener("load", updateHeaderHeight);
if (document.fonts && document.fonts.ready) {
  /* re-measure once webfonts settle, then let the hero canvas re-fit */
  document.fonts.ready.then(() => { updateHeaderHeight(); window.dispatchEvent(new Event("resize")); });
}

$("retryProducts").addEventListener("click", () => loadProducts());

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

  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
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
    const tryLoad = (attempt) => {
      gltfLoader.load(
        "assets/3dimage.glb?v=1",
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
              if ("envMapIntensity" in m) m.envMapIntensity = 1;
              if (m.map) m.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
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
    new THREE.TorusGeometry(1.6, 0.03, 20, 120),
    new THREE.MeshBasicMaterial({
      color: 0xc8f53c,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending, /* draws as light, never a hard cutting line */
      depthWrite: false,                /* bottle depth still hides the back arc → real wrap */
    })
  );
  ring.rotation.x = Math.PI * 0.45;  /* slight tilt — not flat */
  scene.add(ring);

  /* ── Tiny accent ring (counter-rotating) ── */
  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(1.1, 0.018, 12, 96),
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

  /* ── Bubble particle field ── */
  const PARTS = 160;
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
  const railDots  = [...document.querySelectorAll(".rail-dot")];
  const railFills = [...document.querySelectorAll(".rail-track > span")];
  const cueEl    = $("scrollCue");
  const statusEl = $("heroStatus");

  let scrollTarget  = 0;
  let scrollCurrent = 0;
  let activeStage   = -1;
  let rafId         = null;
  let heroVisible   = true;
  const clock = new THREE.Clock();

  const smoothstep = (x, a, b) => {
    const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };
  const isMobile = () => innerWidth < 992;

  function setSize() {
    const w = section.clientWidth;
    const h = (sticky && sticky.clientHeight) || innerHeight;  /* tracks svh sticky box, immune to browser chrome */
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  function readScroll() {
    if (!space) return;
    const total = space.offsetHeight - ((sticky && sticky.clientHeight) || innerHeight);
    scrollTarget = total > 0
      ? Math.min(1, Math.max(0, -space.getBoundingClientRect().top / total))
      : 0;
  }

  function setStage(index) {
    if (index === activeStage) return;
    activeStage = index;
    stages.forEach((s, i) => s.classList.toggle("active", i === index));
    railDots.forEach((d, i) => d.classList.toggle("active", i === index));
    if (statusEl) statusEl.textContent = `Stage ${index + 1} of ${stages.length}`;
  }

  function animate() {
    rafId = requestAnimationFrame(animate);
    if (!REDUCED) scrollCurrent += (scrollTarget - scrollCurrent) * 0.045;  /* floaty, premium lag */
    const p  = REDUCED ? 0 : scrollCurrent;  /* reduced motion → static showcase pose */
    const t  = REDUCED ? 0 : clock.getElapsedTime();
    const mb = isMobile();

    /* ── Model: scroll is the controller; idle adds life ── */
    const idleY  = Math.sin(t * 0.6) * 0.12;  /* gentle bob */
    const idleRZ = Math.sin(t * 0.4) * 0.04;  /* gentle lean */
    productGroup.rotation.y  = p * Math.PI * 3 + Math.sin(t * 0.5) * 0.06; /* 1.5 full rounds over the 3-page scroll */
    productGroup.rotation.z  = idleRZ + Math.sin(p * Math.PI) * 0.05;
    productGroup.position.y  = idleY + p * 0.3;

    /* Desktop: model sits on right half, converges to centre at stage 3 */
    const blend = smoothstep(p, 0.6, 1.0);
    if (mb) {
      /* Mobile: large bottle, anchored high above the copy */
      productGroup.position.x = 0;
      productGroup.position.y = 2.1 + p * 0.2;
      productGroup.scale.setScalar(0.92);
    } else {
      /* Desktop/TV: right-side showcase, tablet-and-up sits a touch further right */
      const wideBias = Math.min(0.8, Math.max(0, camera.aspect - 1.45) * 1.4);
      productGroup.position.x = (3.3 + wideBias) * (1 - blend); /* converges to centre at stage 3 */
      productGroup.scale.setScalar(1);
    }

    /* ── Soft scale-in on load ── */
    if (modelHolder) {
      introEase = REDUCED ? 1 : Math.min(1, introEase + (1 - introEase) * 0.055);
      modelHolder.scale.setScalar(modelScale * Math.max(introEase, 0.0001));
    }

    /* ── Rings orbit productGroup — scroll drives the rounds ── */
    ring.position.copy(productGroup.position);
    ring.rotation.y  = t * 0.5 + p * Math.PI * 2;
    ring.rotation.x  = Math.PI * 0.45 + Math.sin(t * 0.3) * 0.06;

    ring2.position.copy(productGroup.position);
    ring2.rotation.y = -t * 0.7 - p * Math.PI * 2.5;
    ring2.rotation.z = Math.PI * 0.25 + t * 0.2;

    /* ── Camera ── */
    if (mb) {
      /* Mobile: tight lens aimed high */
      camera.position.set(0, 0.5, 7.5);
      camera.lookAt(0, 1.4, 0);
    } else {
      /* Desktop: slightly left of centre so model on right is in view */
      const camX = -1.2 + blend * 1.2;  /* moves right as page scrolls */
      const camZ = 6.5 - Math.sin(p * Math.PI) * 0.5;
      camera.position.set(camX, 0.2 + idleY * 0.3, camZ);
      camera.lookAt(productGroup.position.x * 0.45, productGroup.position.y * 0.5, 0);
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
    railFills.forEach((el, i) => {
      el.style.width = `${Math.min(1, Math.max(0, p * 2 - i)) * 100}%`;
    });
    if (cueEl) cueEl.classList.toggle("hide", p > 0.02);
    setStage(p < 0.33 ? 0 : p < 0.66 ? 1 : 2);  /* one stage per scroll on the 3-scroll journey */

    renderer.render(scene, camera);
  }

  const start = () => { if (rafId === null && heroVisible) rafId = requestAnimationFrame(animate); };
  const stop  = () => { if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; } };

  new IntersectionObserver(([entry]) => {
    heroVisible = entry.isIntersecting;
    heroVisible ? start() : stop();
  }).observe(section);

  window.addEventListener("scroll", readScroll, { passive: true });
  window.addEventListener("resize", () => { setSize(); readScroll(); });

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
  if (sessionStorage.getItem("neatify-ann-dismissed")) return;
  setTimeout(() => pop.classList.add("show"), 1200);
  $("annPopClose")?.addEventListener("click", () => {
    pop.classList.remove("show");
    sessionStorage.setItem("neatify-ann-dismissed", "1");
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
