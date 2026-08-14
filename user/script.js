/* ═══════════════════════════════════════════════
   NEATIFY STOREFRONT — Live store logic
   Products, settings, orders and subscribers are
   all synced with the server API in real time.
   ═══════════════════════════════════════════════ */

const CART_KEY = "neatify-cart";
const SHIPPING_FEE = 49;

let products = [];
let settings = { freeShippingThreshold: 999, weekendKitIds: [1, 2, 4, 7], highlightProductId: 3 };
let state = { filter: "all", search: "", sort: "featured", cart: [] };

const $ = (id) => document.getElementById(id);
const productGrid = $("productGrid");
const emptyState = $("emptyState");
const cartCount = $("cartCount");
const cartItems = $("cartItems");
const cartEmpty = $("cartEmpty");
const cartFooter = $("cartFooter");
const cartTotal = $("cartTotal");
const cartSubtotal = $("cartSubtotal");
const cartShipping = $("cartShipping");
const searchPanel = $("searchPanel");
const searchInput = $("searchInput");
const searchResults = $("searchResults");
const mainNav = $("mainNav");
const navMenu = $("navMenu");
const backToTop = $("backToTop");

/* Bootstrap UI is optional — if the CDN is unreachable the store still
   renders products; modals/drawer degrade to no-ops instead of crashing. */
const hasBootstrap = typeof window.bootstrap !== "undefined";
const noopUi = { show() {}, hide() {}, toggle() {} };
const productModal = hasBootstrap ? bootstrap.Modal.getOrCreateInstance("#productModal") : noopUi;
const notifyModal = hasBootstrap ? bootstrap.Modal.getOrCreateInstance("#notifyModal") : noopUi;
const checkoutModal = hasBootstrap ? bootstrap.Modal.getOrCreateInstance("#checkoutModal") : noopUi;
const orderSuccessModal = hasBootstrap ? bootstrap.Modal.getOrCreateInstance("#orderSuccessModal") : noopUi;
const cartDrawer = hasBootstrap ? bootstrap.Offcanvas.getOrCreateInstance("#cartDrawer") : noopUi;
const navCollapse = hasBootstrap ? bootstrap.Collapse.getOrCreateInstance(navMenu, { toggle: false }) : noopUi;

/* ── HELPERS ── */
function money(v) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);
}

function getProduct(id) {
  return products.find((p) => p.id === id);
}

function matchesSearch(product, query) {
  if (!query) return true;
  const haystack = `${product.name} ${product.type} ${product.category} ${product.description}`.toLowerCase();
  return haystack.includes(query.toLowerCase());
}

function esc(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : String(str);
  return div.innerHTML;
}

async function api(path, opts = {}) {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

/* ── SETTINGS (announcement, shipping, kit, highlight) ── */
async function loadSettings() {
  try {
    const data = await api("/api/settings");
    settings = { ...settings, ...data };
  } catch {
    /* keep defaults */
  }
  $("announceMain").textContent = settings.announcement || "Premium car care, made simple.";
  $("announceSub").textContent = settings.announcementSub || `Free shipping on orders above ${money(settings.freeShippingThreshold)}.`;
  $("faqShipThreshold").textContent = money(settings.freeShippingThreshold);
  if ($("heroShipNote")) $("heroShipNote").textContent = money(settings.freeShippingThreshold);
  document.title = `${settings.storeName || "Neatify"} — Clean. Shine. Protect.`;
}

/* ── PRODUCTS ── */
async function loadProducts(attempt = 1) {
  productGrid.innerHTML = `<div class="col-12"><div class="grid-loading"><div class="spinner-ring"></div><span>Loading the lineup…</span></div></div>`;
  try {
    products = await api("/api/products");
  } catch {
    if (attempt < 3) {
      await new Promise((r) => setTimeout(r, 600 * attempt)); // brief backoff, then retry
      return loadProducts(attempt + 1);
    }
    productGrid.innerHTML = "";
    emptyState.classList.remove("d-none");
    $("emptyStateTitle").textContent = "Couldn't load products";
    $("emptyStateText").textContent = "The store API didn't respond. Make sure the server is running (npm start) and you opened http://localhost:3000.";
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
  document.querySelectorAll(".filter-pill").forEach((pill) => {
    const key = pill.dataset.filter;
    const count = key === "all" ? products.length : products.filter((p) => p.category === key).length;
    const label = pill.textContent.replace(/\s*\d+$/, "").trim();
    pill.innerHTML = `${esc(label)}<span class="pill-count">${count}</span>`;
  });
}

function renderBundle() {
  const kitIds = Array.isArray(settings.weekendKitIds) ? settings.weekendKitIds : [];
  const kitProducts = kitIds.map(getProduct).filter(Boolean);
  const total = kitProducts.reduce((s, p) => s + p.price, 0);
  $("bundlePrice").textContent = kitProducts.length ? `${kitProducts.length} essentials · ${money(total)}` : "";

  const highlight = getProduct(settings.highlightProductId);
  if (highlight) $("bundleImage").src = highlight.image;
}

function filteredProducts() {
  let list = products.filter((p) => state.filter === "all" || p.category === state.filter);
  if (state.search) list = list.filter((p) => matchesSearch(p, state.search));
  if (state.sort === "featured") list.sort((a, b) => a.featured - b.featured);
  if (state.sort === "low") list.sort((a, b) => a.price - b.price);
  if (state.sort === "high") list.sort((a, b) => b.price - a.price);
  if (state.sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
  return list;
}

function renderProducts() {
  const list = filteredProducts();
  productGrid.innerHTML = list
    .map(
      (p) => `
    <div class="col-sm-6 col-lg-4 col-xl-3">
      <article class="product-card">
        <div class="product-image" data-id="${p.id}">
          <span class="product-badge ${p.id === settings.highlightProductId ? "lime" : ""}">${esc(p.badge)}</span>
          <button class="product-quick" data-view="${p.id}" aria-label="Quick view ${esc(p.name)}"><i class="bi bi-eye"></i></button>
          <img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy">
        </div>
        <div class="product-info">
          <span class="product-kicker">${esc(p.type)} / Exterior</span>
          <h3>${esc(p.name)}</h3>
          <p>${esc(p.description)}</p>
          <div class="product-bottom">
            <span class="price">${money(p.price)}</span>
            <button class="add-btn" data-add="${p.id}" aria-label="Add ${esc(p.name)} to cart"><i class="bi bi-plus-lg"></i></button>
          </div>
        </div>
      </article>
    </div>`
    )
    .join("");
  if (!list.length) {
    $("emptyStateTitle").textContent = "No products found";
    $("emptyStateText").textContent = "Try another search or category.";
  }
  emptyState.classList.toggle("d-none", list.length !== 0);
}

/* ── CART ── */
function loadCart() {
  try {
    const saved = localStorage.getItem(CART_KEY);
    if (!saved) return;
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) {
      state.cart = parsed.filter((item) => getProduct(item.id) && item.qty > 0);
    }
  } catch {
    state.cart = [];
  }
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(state.cart));
}

function cartSubtotalValue() {
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
  const product = getProduct(id);
  if (!product) return;
  const found = state.cart.find((i) => i.id === id);
  if (found) found.qty++;
  else state.cart.push({ id, qty: 1 });
  saveCart();
  renderCart();
  bumpCartBadge();
  showToast(`${product.name} added to cart`);
  if (openDrawer) cartDrawer.show();
}

function addBundle(ids) {
  const added = ids.map(getProduct).filter(Boolean);
  if (!added.length) return;
  added.forEach((p) => {
    const found = state.cart.find((i) => i.id === p.id);
    if (found) found.qty++;
    else state.cart.push({ id: p.id, qty: 1 });
  });
  saveCart();
  renderCart();
  bumpCartBadge();
  showToast("Weekend kit essentials added to cart");
  cartDrawer.show();
}

function bumpCartBadge() {
  cartCount.classList.remove("bump");
  void cartCount.offsetWidth;
  cartCount.classList.add("bump");
}

function renderCart() {
  const count = state.cart.reduce((s, i) => s + i.qty, 0);
  cartCount.textContent = count;
  cartCount.style.display = count ? "grid" : "none";

  if (!state.cart.length) {
    cartItems.innerHTML = "";
    cartEmpty.classList.remove("d-none");
    cartFooter.classList.add("d-none");
    return;
  }

  cartEmpty.classList.add("d-none");
  cartFooter.classList.remove("d-none");
  cartItems.innerHTML = state.cart
    .map((item) => {
      const p = getProduct(item.id);
      if (!p) return "";
      return `<div class="cart-item">
      <img src="${esc(p.image)}" alt="${esc(p.name)}">
      <div><h4>${esc(p.name)}</h4><p>${money(p.price)} each</p>
        <div class="qty-control">
          <button data-qty="${p.id}" data-delta="-1" aria-label="Decrease quantity of ${esc(p.name)}">−</button>
          <strong aria-live="polite">${item.qty}</strong>
          <button data-qty="${p.id}" data-delta="1" aria-label="Increase quantity of ${esc(p.name)}">+</button>
        </div>
      </div>
      <button class="remove-item" data-remove="${p.id}" aria-label="Remove ${esc(p.name)} from cart"><i class="bi bi-trash3"></i></button>
    </div>`;
    })
    .join("");

  const subtotal = cartSubtotalValue();
  const shipping = shippingFor(subtotal);
  cartSubtotal.textContent = money(subtotal);
  cartShipping.textContent = shipping === 0 ? "FREE" : money(shipping);
  cartTotal.textContent = money(subtotal + shipping);
  renderShipProgress(subtotal);
}

function renderShipProgress(subtotal) {
  const threshold = settings.freeShippingThreshold || 999;
  const msg = $("shipMessage");
  const fill = $("shipFill");
  if (subtotal >= threshold) {
    msg.innerHTML = `<b>You unlocked FREE shipping!</b> 🎉`;
    msg.classList.add("free");
    fill.style.width = "100%";
  } else {
    msg.innerHTML = `Add <b>${money(threshold - subtotal)}</b> more for free shipping`;
    msg.classList.remove("free");
    fill.style.width = `${Math.min(100, Math.round((subtotal / threshold) * 100))}%`;
  }
}

/* ── CHECKOUT ── */
function openCheckout() {
  if (!state.cart.length) return;
  renderCheckoutSummary();
  cartDrawer.hide();
  checkoutModal.show();
}

function renderCheckoutSummary() {
  const items = state.cart
    .map((item) => {
      const p = getProduct(item.id);
      if (!p) return "";
      return `<div class="checkout-line-item">
        <span>${esc(p.name)}<small>Qty ${item.qty} × ${money(p.price)}</small></span>
        <span>${money(p.price * item.qty)}</span>
      </div>`;
    })
    .join("");
  $("checkoutItems").innerHTML = items;

  const subtotal = cartSubtotalValue();
  const shipping = shippingFor(subtotal);
  $("coSubtotal").textContent = money(subtotal);
  $("coShipping").textContent = shipping === 0 ? "FREE" : money(shipping);
  $("coTotal").textContent = money(subtotal + shipping);
}

function validateCheckout() {
  let valid = true;
  const rules = [
    { id: "coName", err: "coNameError", test: (v) => v.length >= 2, message: "Please enter your name" },
    { id: "coPhone", err: "coPhoneError", test: (v) => /^[+\d][\d\s\-()]{7,14}$/.test(v), message: "Enter a valid phone number" },
    { id: "coEmail", err: "coEmailError", test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: "Enter a valid email" },
    { id: "coAddress", err: "coAddressError", test: (v) => v.length >= 10, message: "Please enter a full delivery address" },
  ];
  rules.forEach((rule) => {
    const input = $(rule.id);
    const error = $(rule.err);
    const ok = rule.test(input.value.trim());
    input.classList.toggle("invalid", !ok);
    error.textContent = ok ? "" : rule.message;
    if (!ok) valid = false;
  });
  return valid;
}

async function placeOrder(e) {
  e.preventDefault();
  if (!validateCheckout() || !state.cart.length) return;

  const btn = $("placeOrderBtn");
  btn.disabled = true;
  btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Placing order…`;

  const subtotal = cartSubtotalValue();
  const shipping = shippingFor(subtotal);
  const payload = {
    items: state.cart.map((item) => {
      const p = getProduct(item.id);
      return { id: p.id, name: p.name, price: p.price, qty: item.qty };
    }),
    total: subtotal + shipping,
    shipping,
    customer: {
      name: $("coName").value.trim(),
      phone: $("coPhone").value.trim(),
      email: $("coEmail").value.trim(),
      address: $("coAddress").value.trim(),
      notes: $("coNotes").value.trim(),
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
    orderSuccessModal.show();
  } catch (err) {
    showToast(err.message || "Could not place order. Try again.", true);
  } finally {
    btn.disabled = false;
    btn.innerHTML = `Place order <i class="bi bi-check2-circle ms-1"></i>`;
  }
}

/* ── SUBSCRIBERS ── */
async function subscribe(email, type, button) {
  button.disabled = true;
  try {
    const res = await api("/api/subscribers", { method: "POST", body: JSON.stringify({ email, type }) });
    if (res.duplicate) {
      showToast(type === "newsletter" ? "You're already subscribed." : "You're already on the launch list.");
    } else {
      showToast(type === "newsletter" ? "Welcome to Neatify Notes. 💌" : "You're on the interior launch list. 🔔");
    }
    return true;
  } catch (err) {
    showToast(err.message || "Subscription failed", true);
    return false;
  } finally {
    button.disabled = false;
  }
}

/* ── TOASTS ── */
function showToast(message, isError = false) {
  const el = document.createElement("div");
  el.className = "toast align-items-center border-0";
  el.setAttribute("role", "alert");
  el.setAttribute("aria-live", "assertive");
  const icon = isError ? "bi-exclamation-circle-fill me-2 text-danger" : "bi-check-circle-fill me-2";
  const safe = esc(message);
  el.innerHTML = `<div class="d-flex"><div class="toast-body"><i class="bi ${icon}"></i>${safe}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button></div>`;
  $("toastContainer").appendChild(el);
  const t = new bootstrap.Toast(el, { delay: 2800 });
  t.show();
  el.addEventListener("hidden.bs.toast", () => el.remove());
}

/* ── PRODUCT QUICK VIEW ── */
function openProduct(id) {
  const p = getProduct(id);
  if (!p) return;
  $("productModalContent").innerHTML = `
    <div class="col-md-6 modal-product-image"><img src="${esc(p.image)}" alt="${esc(p.name)}"></div>
    <div class="col-md-6 modal-product-copy">
      <span class="product-kicker">${esc(p.type)} / Exterior Care</span>
      <h2 id="productModalTitle">${esc(p.name)}</h2>
      <div class="price mb-3">${money(p.price)}</div>
      <p>${esc(p.description)}</p>
      <ul class="detail-points">${(p.points || []).map((x) => `<li><i class="bi bi-check2"></i>${esc(x)}</li>`).join("")}</ul>
      <button class="btn btn-dark w-100" data-modal-add="${p.id}">Add to cart <i class="bi bi-bag ms-1"></i></button>
    </div>`;
  $("productModal").setAttribute("aria-labelledby", "productModalTitle");
  productModal.show();
}

/* ── SEARCH ── */
function closeSearch() {
  searchPanel.classList.remove("open");
  searchInput.value = "";
  state.search = "";
  searchResults.innerHTML = "";
  renderProducts();
}

function renderSearchResults() {
  const query = state.search.trim();
  if (!query) {
    searchResults.innerHTML = "";
    return;
  }
  const results = products.filter((p) => matchesSearch(p, query)).slice(0, 5);
  searchResults.innerHTML = results.length
    ? results
        .map(
          (p) =>
            `<div class="search-result" data-search-id="${p.id}" role="option"><span>${esc(p.name)}</span><strong>${money(p.price)}</strong></div>`
        )
        .join("")
    : "<div class='search-result' role='status'>No matching product</div>";
}

function updateSearchPanelOffset() {
  const announcement = document.querySelector(".announcement");
  const headerHeight = (announcement?.offsetHeight || 0) + (mainNav?.offsetHeight || 0);
  document.documentElement.style.setProperty("--header-height", `${headerHeight}px`);
}

function updateActiveNav() {
  const navLinks = document.querySelectorAll("#navMenu .nav-link");
  const scrollPos = window.scrollY + 120;
  let current = "home";

  document.querySelectorAll("main > section[id], main[id]").forEach((section) => {
    if (section.offsetTop <= scrollPos) current = section.id || "home";
  });

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    link.classList.toggle("active", href === `#${current}`);
  });
}

/* ── SCROLL REVEAL ── */
function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    els.forEach((el) => el.classList.add("visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  els.forEach((el) => io.observe(el));
}

/* ── EVENTS ── */
document.addEventListener("click", (e) => {
  const add = e.target.closest("[data-add]");
  if (add) {
    addToCart(Number(add.dataset.add));
    return;
  }

  const view = e.target.closest("[data-view]");
  if (view) {
    openProduct(Number(view.dataset.view));
    return;
  }

  const image = e.target.closest(".product-image");
  if (image && !e.target.closest("button")) {
    openProduct(Number(image.dataset.id));
    return;
  }

  const modalAdd = e.target.closest("[data-modal-add]");
  if (modalAdd) {
    addToCart(Number(modalAdd.dataset.modalAdd));
    productModal.hide();
    cartDrawer.show();
    return;
  }

  const qty = e.target.closest("[data-qty]");
  if (qty) {
    const id = Number(qty.dataset.qty);
    const item = state.cart.find((i) => i.id === id);
    if (!item) return;
    item.qty += Number(qty.dataset.delta);
    if (item.qty <= 0) state.cart = state.cart.filter((i) => i.id !== id);
    saveCart();
    renderCart();
    return;
  }

  const rem = e.target.closest("[data-remove]");
  if (rem) {
    state.cart = state.cart.filter((i) => i.id !== Number(rem.dataset.remove));
    saveCart();
    renderCart();
  }
});

document.querySelectorAll(".filter-pill").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-pill").forEach((x) => {
      x.classList.remove("active");
      x.setAttribute("aria-pressed", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-pressed", "true");
    state.filter = btn.dataset.filter;
    renderProducts();
  });
});

$("sortSelect").addEventListener("change", (e) => {
  state.sort = e.target.value;
  renderProducts();
});

$("cartToggle").addEventListener("click", () => cartDrawer.show());
$("checkoutBtn").addEventListener("click", openCheckout);
$("checkoutForm").addEventListener("submit", placeOrder);
$("bundleBtn").addEventListener("click", () => addBundle(settings.weekendKitIds || []));

$("searchToggle").addEventListener("click", () => {
  searchPanel.classList.add("open");
  updateSearchPanelOffset();
  searchInput.focus();
});

$("searchClose").addEventListener("click", closeSearch);

searchInput.addEventListener("input", () => {
  state.search = searchInput.value.trim();
  renderProducts();
  renderSearchResults();
});

searchResults.addEventListener("click", (e) => {
  const r = e.target.closest("[data-search-id]");
  if (!r) return;
  openProduct(Number(r.dataset.searchId));
  closeSearch();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && searchPanel.classList.contains("open")) closeSearch();
});

document.querySelectorAll("#navMenu .nav-link").forEach((a) => {
  a.addEventListener("click", () => navCollapse.hide());
});

document.querySelectorAll(".socials a").forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    showToast("Social profiles coming soon.");
  });
});

backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

window.addEventListener(
  "scroll",
  () => {
    mainNav.classList.toggle("scrolled", scrollY > 20);
    backToTop.classList.toggle("show", scrollY > 700);
    updateActiveNav();
  },
  { passive: true }
);

window.addEventListener("resize", updateSearchPanelOffset);

$("notifyBtn").addEventListener("click", () => notifyModal.show());
$("footerNotify").addEventListener("click", () => notifyModal.show());

$("notifyForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = e.target.querySelector("input[type=email]");
  const ok = await subscribe(input.value.trim(), "notify", $("notifySubmit"));
  if (ok) {
    notifyModal.hide();
    e.target.reset();
  }
});

$("newsletterForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = $("emailInput");
  if (!input.checkValidity()) {
    input.reportValidity();
    return;
  }
  const ok = await subscribe(input.value.trim(), "newsletter", $("newsletterBtn"));
  if (ok) e.target.reset();
});

/* ── 3D SCROLL HERO (Three.js) ── */
function showHeroFallback(section) {
  section.classList.add("no-3d");
  $("heroFallback")?.classList.remove("d-none");
  $("heroCanvas")?.classList.add("d-none");
}

function initHero3D() {
  const section = $("heroSection");
  const canvas = $("heroCanvas");
  if (!section || !canvas) return;

  // Reduced motion or missing Three.js → accessible static fallback
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !window.THREE) {
    showHeroFallback(section);
    return;
  }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    showHeroFallback(section);
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);

  // Lighting — brand palette: lime key, electric blue fill, white rim
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const limeLight = new THREE.PointLight(0xd7ff3f, 1.4, 40);
  limeLight.position.set(4, 3, 5);
  scene.add(limeLight);
  const blueLight = new THREE.PointLight(0x2182dc, 1.2, 40);
  blueLight.position.set(-5, -2, 4);
  scene.add(blueLight);
  const rimLight = new THREE.PointLight(0xffffff, 0.5, 40);
  rimLight.position.set(0, 5, -6);
  scene.add(rimLight);

  /* ── YOUR PRODUCT in 3D ──
     The real GLB model spins and travels through the scroll journey.
     Swap the path below to feature a different model. */
  const HERO_MODEL = "assets/3dimage.glb";

  const product = new THREE.Group();
  scene.add(product);

  let modelHolder = null; // set once the GLB arrives
  let modelBaseScale = 1;
  let introScale = 0; // eased 0 → 1 for a soft entrance
  const loaderEl = $("modelLoader");
  const loaderText = $("modelLoaderText");

  if (THREE.GLTFLoader) {
    new THREE.GLTFLoader().load(
      HERO_MODEL,
      (gltf) => {
        const model = gltf.scene;
        // Center the model on the origin
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        model.position.set(-center.x, -center.y, -center.z);
        modelHolder = new THREE.Group();
        modelHolder.add(model);
        // Fit the tallest axis to the stage height
        modelBaseScale = 4.4 / (Math.max(size.x, size.y, size.z) || 1);
        modelHolder.scale.setScalar(0.0001);
        product.add(modelHolder);
        loaderEl?.classList.add("d-none");
      },
      (xhr) => {
        // Visible progress feedback while the heavy model streams in
        if (xhr.total && loaderEl && loaderText) {
          loaderEl.classList.remove("d-none");
          loaderText.textContent = `Loading 3D model… ${Math.round((xhr.loaded / xhr.total) * 100)}%`;
        }
      },
      () => {
        loaderEl?.classList.add("d-none");
      }
    );
  }

  // Orbiting podium ring under the product
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(2.6, 0.04, 16, 90),
    new THREE.MeshStandardMaterial({
      color: 0xd7ff3f, emissive: 0xd7ff3f, emissiveIntensity: 0.7,
      metalness: 0.4, roughness: 0.3,
    })
  );
  ring.rotation.x = Math.PI / 2.2;
  ring.position.y = -2.3;
  scene.add(ring);

  // Foam bubble particle field
  const PARTICLES = 170;
  const positions = new Float32Array(PARTICLES * 3);
  const speeds = new Float32Array(PARTICLES);
  for (let i = 0; i < PARTICLES; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 13;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1;
    speeds[i] = 0.15 + Math.random() * 0.4;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  scene.add(
    new THREE.Points(
      particleGeo,
      new THREE.PointsMaterial({ color: 0xd7ff3f, size: 0.055, transparent: true, opacity: 0.5 })
    )
  );

  // Scroll state with damping (native scroll drives the scene)
  const space = section.querySelector(".hero-scroll-space");
  const stages = [...document.querySelectorAll(".hero-stage")];
  const dots = [...document.querySelectorAll(".rail-label")];
  const fill = $("heroProgressFill");
  const cue = $("scrollCue");
  const statusEl = $("heroStatus");
  let target = 0;
  let current = 0;
  let activeStage = 0;
  let rafId = null;
  let heroVisible = true;
  const clock = new THREE.Clock();

  const smooth = (x, a, b) => {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };
  const isMobile = () => window.innerWidth < 992;

  function setSize() {
    camera.aspect = section.clientWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(section.clientWidth, window.innerHeight);
  }

  function readScroll() {
    const total = space.offsetHeight - window.innerHeight;
    target = total > 0 ? Math.min(1, Math.max(0, -space.getBoundingClientRect().top / total)) : 0;
  }

  function setStage(index) {
    if (index === activeStage) return;
    activeStage = index;
    stages.forEach((s, i) => s.classList.toggle("active", i === index));
    dots.forEach((d, i) => d.classList.toggle("on", i === index));
    statusEl.textContent = `Viewing stage ${index + 1} of ${stages.length}`;
  }

  function animate() {
    rafId = requestAnimationFrame(animate);
    current += (target - current) * 0.08; // damped, buttery follow
    const p = current;
    const t = clock.getElapsedTime();
    const mobile = isMobile();

    // Scroll-linked product spin, tilt, drift and re-center for the finale
    product.rotation.y = p * Math.PI * 2.5 + Math.sin(t * 0.6) * 0.05;
    product.rotation.z = Math.sin(p * Math.PI) * 0.08;
    const centerBlend = smooth(p, 0.55, 0.95);
    product.position.x = mobile ? 0 : 1.8 * (1 - centerBlend);
    product.position.y = 0.05 + p * 0.35 + Math.sin(t * 0.8) * 0.06;
    product.scale.setScalar(mobile ? 0.62 : 1);

    // Soft scale-in once the GLB arrives
    if (modelHolder) {
      introScale += (1 - introScale) * 0.07;
      modelHolder.scale.setScalar(modelBaseScale * Math.max(introScale, 0.0001));
    }

    // Podium ring reacts to scroll too
    ring.rotation.z = t * 0.25 + p * Math.PI;
    ring.position.x = product.position.x;
    ring.position.y = product.position.y - 2.35;

    // Camera dolly through the journey
    camera.position.set(0, 0.4 - p * 0.2, (mobile ? 9.4 : 7.6) - Math.sin(p * Math.PI) * 1);
    camera.lookAt(product.position.x * 0.45, 0.1, 0);

    // Lime light orbits the product as you scroll
    const orbit = p * Math.PI * 2;
    limeLight.position.set(Math.cos(orbit) * 4.5, 2.6, Math.sin(orbit) * 4.5 + 1);

    // Foam bubbles drift upward
    const pos = particleGeo.attributes.position.array;
    for (let i = 0; i < PARTICLES; i++) {
      pos[i * 3 + 1] += speeds[i] * 0.016;
      if (pos[i * 3 + 1] > 4.5) pos[i * 3 + 1] = -4.5;
    }
    particleGeo.attributes.position.needsUpdate = true;

    // UI sync: progress bar, cue, stage crossfade
    fill.style.height = `${p * 100}%`;
    cue.classList.toggle("hide", p > 0.02);
    setStage(p < 0.36 ? 0 : p < 0.72 ? 1 : 2);

    renderer.render(scene, camera);
  }

  function start() {
    if (rafId === null && heroVisible) rafId = requestAnimationFrame(animate);
  }
  function stop() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  // Pause rendering when the hero is off-screen (performance)
  new IntersectionObserver(([entry]) => {
    heroVisible = entry.isIntersecting;
    if (heroVisible) start();
    else stop();
  }).observe(section);

  window.addEventListener("scroll", readScroll, { passive: true });
  window.addEventListener("resize", () => {
    setSize();
    readScroll();
  });

  $("heroKitBtn")?.addEventListener("click", () => addBundle(settings.weekendKitIds || []));

  setSize();
  readScroll();
  start();
}

/* ── BOOT ── */
async function boot() {
  if (location.protocol === "file:") {
    showToast("Open the store via http://localhost:3000 (run npm start first).", true);
  }
  // Each step is isolated so one failure can never block the rest
  const step = (fn) => Promise.resolve().then(fn).catch((err) => console.error("Boot step failed:", err));
  await step(updateSearchPanelOffset);
  await step(initReveal);
  await step(initHero3D);
  await step(loadSettings);
  await step(loadProducts);
  await step(loadCart);
  await step(renderCart);
  await step(updateActiveNav);
}

$("retryProducts").addEventListener("click", () => loadProducts());

boot();
