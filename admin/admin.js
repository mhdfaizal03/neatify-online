/* ═══════════════════════════════════════════════
   NEATIFY ADMIN DASHBOARD — Application Logic
   ═══════════════════════════════════════════════ */

(() => {
  "use strict";

  /* ── STATE ── */
  const state = {
    token: localStorage.getItem("neatify_token") || null,
    currentView: "dashboard",
    products: [],
    allProducts: [],
    orders: [],
    subscribers: [],
    media: [],
    stats: null,
    editingProduct: null,
  };

  /* ── DOM REFS ── */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const loginScreen = $("#loginScreen");
  const adminApp = $("#adminApp");
  const loginForm = $("#loginForm");
  const loginError = $("#loginError");
  const sidebar = $("#sidebar");
  const sidebarToggle = $("#sidebarToggle");
  const logoutBtn = $("#logoutBtn");
  const globalSearch = $("#globalSearch");
  const snackbar = $("#snackbar");

  /* ── HELPERS ── */
  async function api(path, opts = {}) {
    const headers = { "Content-Type": "application/json", ...(opts.headers || {}) };
    if (state.token) headers.Authorization = `Bearer ${state.token}`;

    // Don't set Content-Type for FormData (file uploads)
    if (opts.body instanceof FormData) delete headers["Content-Type"];

    const res = await fetch(path, { ...opts, headers });
    if (res.status === 401) {
      logout();
      throw new Error("Session expired");
    }
    // Parse tolerantly so a non-JSON reply (wrong origin, proxy, static server)
    // produces a clear message instead of a raw browser JSON error
    const text = await res.text();
    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      throw new Error(
        `The API didn't respond (HTTP ${res.status}). Make sure the server is running (npm start) and you opened http://localhost:3000/admin/`
      );
    }
    if (!res.ok) throw new Error(data.error || "Request failed");
    return data;
  }

  function currency(n) {
    return "₹" + Number(n || 0).toLocaleString("en-IN");
  }

  function formatDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  function escHtml(str) {
    const div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
  }

  let snackTimer;
  function showSnack(msg, type = "success") {
    clearTimeout(snackTimer);
    snackbar.textContent = msg;
    snackbar.className = `snackbar ${type}`;
    requestAnimationFrame(() => snackbar.classList.add("show"));
    snackTimer = setTimeout(() => snackbar.classList.remove("show"), 3200);
  }

  /* ── AUTH ── */
  async function login(username, password) {
    const data = await api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    state.token = data.token;
    localStorage.setItem("neatify_token", data.token);
    showApp(data.username);
  }

  function logout() {
    state.token = null;
    localStorage.removeItem("neatify_token");
    loginScreen.classList.remove("hidden");
    adminApp.classList.add("hidden");
    loginError.textContent = "";
  }

  async function checkSession() {
    if (!state.token) return false;
    try {
      const me = await api("/api/auth/me");
      showApp(me.username);
      return true;
    } catch {
      state.token = null;
      localStorage.removeItem("neatify_token");
      return false;
    }
  }

  function showApp(username) {
    loginScreen.classList.add("hidden");
    adminApp.classList.remove("hidden");
    $("#adminUser").textContent = username || "admin";
    loadDashboard();
  }

  /* ── NAVIGATION ── */
  function switchView(viewName) {
    state.currentView = viewName;

    $$(".nav-item").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.view === viewName);
    });

    $$(".view").forEach((v) => v.classList.remove("active"));
    const target = $(`#view-${viewName}`);
    if (target) target.classList.add("active");

    // Close mobile sidebar
    sidebar.classList.remove("open");
    document.querySelector(".sidebar-overlay")?.classList.remove("show");

    // Load view data
    switch (viewName) {
      case "dashboard": loadDashboard(); break;
      case "products": loadProducts(); break;
      case "media": loadMedia(); break;
      case "orders": loadOrders(); break;
      case "subscribers": loadSubscribers(); break;
      case "settings": loadSettings(); break;
    }
  }

  /* ── DASHBOARD ── */
  async function loadDashboard() {
    try {
      const stats = await api("/api/stats");
      state.stats = stats;
      renderStats(stats);
      renderCategoryChart(stats.categoryCounts);
      renderRecentOrders(stats.recentOrders);
    } catch (err) {
      console.error("Dashboard load error:", err);
    }
  }

  function renderStats(s) {
    const grid = $("#statGrid");
    const cards = [
      {
        icon: "bi-box-seam", color: "green",
        value: s.totalProducts,
        label: "Active Products",
        change: s.inactiveProducts > 0 ? `${s.inactiveProducts} inactive` : "All live",
        changeType: s.inactiveProducts > 0 ? "neutral" : "up",
      },
      {
        icon: "bi-receipt", color: "blue",
        value: s.totalOrders,
        label: "Total Orders",
        change: s.totalOrders > 0 ? "Active" : "No orders yet",
        changeType: "neutral",
      },
      {
        icon: "bi-currency-rupee", color: "yellow",
        value: currency(s.totalRevenue),
        label: "Total Revenue",
        change: s.avgOrderValue > 0 ? `Avg ${currency(s.avgOrderValue)}` : "—",
        changeType: "neutral",
      },
      {
        icon: "bi-envelope-heart", color: "pink",
        value: s.totalSubscribers,
        label: "Subscribers",
        change: `${s.newsletterCount} newsletter`,
        changeType: "neutral",
      },
    ];

    grid.innerHTML = cards
      .map(
        (c) => `
      <div class="stat-card">
        <div class="stat-icon ${c.color}"><i class="bi ${c.icon}"></i></div>
        <div class="stat-value">${escHtml(String(c.value))}</div>
        <div class="stat-label">${escHtml(c.label)}</div>
        <span class="stat-change ${c.changeType}">${escHtml(c.change)}</span>
      </div>`
      )
      .join("");
  }

  function renderCategoryChart(counts) {
    const el = $("#categoryChart");
    const entries = Object.entries(counts);
    if (!entries.length) {
      el.innerHTML = `<div class="empty-state-msg"><i class="bi bi-bar-chart"></i><p>No product categories yet</p></div>`;
      return;
    }

    const max = Math.max(...entries.map(([, v]) => v), 1);
    const colors = ["#d7ff3f", "#60a5fa", "#fbbf24", "#ff4d6a", "#34d399", "#a78bfa"];

    el.innerHTML = entries
      .map(
        ([cat, count], i) => `
      <div class="cat-bar-row">
        <span class="cat-bar-label">${escHtml(cat)}</span>
        <div class="cat-bar-track">
          <div class="cat-bar-fill" style="width:${(count / max) * 100}%;background:${colors[i % colors.length]}"></div>
        </div>
        <span class="cat-bar-count">${count}</span>
      </div>`
      )
      .join("");
  }

  function renderRecentOrders(orders) {
    const el = $("#recentOrders");
    if (!orders || !orders.length) {
      el.innerHTML = `<div class="empty-state-msg"><i class="bi bi-receipt"></i><p>No orders yet.<br>Orders placed by customers will appear here.</p></div>`;
      return;
    }

    el.innerHTML = orders
      .map(
        (o) => `
      <div class="recent-order-row">
        <div>
          <div class="recent-order-id">${escHtml(o.id)}</div>
          <div class="recent-order-meta">${o.items?.length || 0} item(s) · ${formatDate(o.createdAt)}</div>
        </div>
        <div class="recent-order-total">${currency(o.total)}</div>
      </div>`
      )
      .join("");
  }

  /* ── PRODUCTS ── */
  async function loadProducts() {
    try {
      const all = await api("/api/products/all");
      state.allProducts = all;
      filterAndRenderProducts();
    } catch (err) {
      console.error("Products load error:", err);
      showSnack("Failed to load products", "error");
    }
  }

  function filterAndRenderProducts() {
    const statusFilter = $("#productFilter").value;
    const catFilter = $("#productCategoryFilter").value;
    const query = globalSearch.value.toLowerCase().trim();

    let list = [...state.allProducts];

    // Status filter
    if (statusFilter === "active") list = list.filter((p) => p.active !== false);
    else if (statusFilter === "inactive") list = list.filter((p) => p.active === false);

    // Category filter
    if (catFilter) list = list.filter((p) => p.category === catFilter);

    // Search
    if (query) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          (p.description || "").toLowerCase().includes(query)
      );
    }

    state.products = list;
    renderProductsTable(list);
  }

  function renderProductsTable(products) {
    const tbody = $("#productsTable");

    if (!products.length) {
      tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state-msg"><i class="bi bi-box-seam"></i><p>No products found</p></div></td></tr>`;
      return;
    }

    tbody.innerHTML = products
      .map(
        (p) => `
      <tr data-id="${p.id}">
        <td>
          <div class="product-cell">
            <img src="/${escHtml(p.image)}" alt="" class="product-thumb" loading="lazy" onerror="this.style.opacity='.3'">
            <div>
              <div class="product-name">${escHtml(p.name)}</div>
              <div class="product-type">${escHtml(p.type || "")}</div>
            </div>
          </div>
        </td>
        <td><span style="text-transform:capitalize">${escHtml(p.category)}</span></td>
        <td class="price-cell">${currency(p.price)}</td>
        <td>${p.featured || "—"}</td>
        <td><span class="status-badge ${p.active !== false ? "active" : "inactive"}">${p.active !== false ? "Active" : "Inactive"}</span></td>
        <td>
          <div class="row-actions">
            <button class="icon-action" title="Edit" onclick="window.__admin.editProduct(${p.id})"><i class="bi bi-pencil"></i></button>
            ${
              p.active !== false
                ? `<button class="icon-action danger" title="Deactivate" onclick="window.__admin.deactivateProduct(${p.id})"><i class="bi bi-eye-slash"></i></button>`
                : `<button class="icon-action success" title="Restore" onclick="window.__admin.restoreProduct(${p.id})"><i class="bi bi-arrow-counterclockwise"></i></button>`
            }
          </div>
        </td>
      </tr>`
      )
      .join("");
  }

  function openProductModal(product = null) {
    state.editingProduct = product;
    const modal = $("#productModal");
    const title = $("#productModalTitle");
    const form = $("#productForm");

    title.textContent = product ? "Edit product" : "Add product";
    form.reset();

    if (product) {
      $("#productId").value = product.id;
      $("#productName").value = product.name || "";
      $("#productCategory").value = product.category || "wash";
      $("#productType").value = product.type || "";
      $("#productPrice").value = product.price || 0;
      $("#productFeatured").value = product.featured || 1;
      $("#productBadge").value = product.badge || "";
      $("#productImage").value = product.image || "";
      $("#productDescription").value = product.description || "";
      $("#productPoints").value = (product.points || []).join("\n");
      $("#productActive").checked = product.active !== false;
    } else {
      $("#productId").value = "";
      $("#productActive").checked = true;
      $("#productFeatured").value = 1;
      $("#productBadge").value = "New";
    }

    modal.classList.remove("hidden");
  }

  function closeProductModal() {
    $("#productModal").classList.add("hidden");
    state.editingProduct = null;
  }

  async function saveProduct(e) {
    e.preventDefault();
    const id = $("#productId").value;
    const body = {
      name: $("#productName").value.trim(),
      category: $("#productCategory").value,
      type: $("#productType").value.trim(),
      price: Number($("#productPrice").value) || 0,
      featured: Number($("#productFeatured").value) || 1,
      badge: $("#productBadge").value.trim(),
      image: $("#productImage").value.trim() || "assets/product-1.jpeg",
      description: $("#productDescription").value.trim(),
      points: $("#productPoints").value.split("\n").map((s) => s.trim()).filter(Boolean),
      active: $("#productActive").checked,
    };

    try {
      if (id) {
        await api(`/api/products/${id}`, { method: "PUT", body: JSON.stringify(body) });
        showSnack("Product updated successfully");
      } else {
        await api("/api/products", { method: "POST", body: JSON.stringify(body) });
        showSnack("Product created successfully");
      }
      closeProductModal();
      loadProducts();
      // Also refresh stats if dashboard is visible
      loadDashboard();
    } catch (err) {
      showSnack(err.message || "Save failed", "error");
    }
  }

  async function deactivateProduct(id) {
    if (!confirm("Deactivate this product? It will be hidden from the storefront.")) return;
    try {
      await api(`/api/products/${id}`, { method: "DELETE" });
      showSnack("Product deactivated");
      loadProducts();
      loadDashboard();
    } catch (err) {
      showSnack(err.message, "error");
    }
  }

  async function restoreProduct(id) {
    try {
      await api(`/api/products/${id}/restore`, { method: "PATCH" });
      showSnack("Product restored");
      loadProducts();
      loadDashboard();
    } catch (err) {
      showSnack(err.message, "error");
    }
  }

  /* ── MEDIA ── */
  async function loadMedia() {
    try {
      const files = await api("/api/media");
      state.media = files;
      renderMediaGrid(files, "#mediaGrid", false);
    } catch (err) {
      console.error("Media load error:", err);
      showSnack("Failed to load media", "error");
    }
  }

  function renderMediaGrid(files, containerSel, isPicker) {
    const el = $(containerSel);
    if (!files.length) {
      el.innerHTML = `<div class="empty-state-msg" style="grid-column:1/-1"><i class="bi bi-images"></i><p>No images found.<br>Upload your first product image.</p></div>`;
      return;
    }

    el.innerHTML = files
      .map(
        (f) => `
      <div class="media-card" data-url="${escHtml(f.url)}" ${isPicker ? `onclick="window.__admin.pickImage('${escHtml(f.url)}')"` : ""}>
        <span class="media-source-badge">${f.source === "upload" ? "Uploaded" : "Library"}</span>
        <img src="/${escHtml(f.url)}" alt="${escHtml(f.name)}" loading="lazy" onerror="this.style.opacity='.3'">
        <div class="media-card-info">
          <div class="media-card-name">${escHtml(f.name)}</div>
          <div class="media-card-meta">${formatSize(f.size)} · ${formatDate(f.uploadedAt)}</div>
        </div>
        ${!isPicker && f.source === "upload" ? `<button class="media-delete" onclick="event.stopPropagation();window.__admin.deleteMedia('${escHtml(f.url)}')" title="Delete"><i class="bi bi-trash3"></i></button>` : ""}
      </div>`
      )
      .join("");
  }

  async function uploadMedia(file) {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const result = await api("/api/media/upload", {
        method: "POST",
        body: formData,
      });
      showSnack(`Uploaded: ${result.name}`);
      loadMedia();
    } catch (err) {
      showSnack(err.message || "Upload failed", "error");
    }
  }

  async function deleteMedia(url) {
    if (!confirm("Delete this uploaded image? This cannot be undone.")) return;
    try {
      await api("/api/media", { method: "DELETE", body: JSON.stringify({ url }) });
      showSnack("Image deleted");
      loadMedia();
    } catch (err) {
      showSnack(err.message, "error");
    }
  }

  /* Image picker (for product form) */
  function openImagePicker() {
    const modal = $("#imagePickerModal");
    modal.classList.remove("hidden");

    // Load media if not loaded
    api("/api/media").then((files) => {
      renderMediaGrid(files, "#pickerGrid", true);
    });
  }

  function closeImagePicker() {
    $("#imagePickerModal").classList.add("hidden");
  }

  function pickImage(url) {
    $("#productImage").value = url;
    closeImagePicker();
  }

  /* ── ORDERS ── */
  async function loadOrders() {
    try {
      const orders = await api("/api/orders");
      state.orders = orders;
      renderOrdersTable(orders);
    } catch (err) {
      console.error("Orders load error:", err);
      showSnack("Failed to load orders", "error");
    }
  }

  function renderOrdersTable(orders) {
    const tbody = $("#ordersTable");
    const query = globalSearch.value.toLowerCase().trim();

    let list = [...orders].reverse(); // newest first
    if (query) {
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(query) ||
          (o.customer?.name || "").toLowerCase().includes(query) ||
          (o.customer?.email || "").toLowerCase().includes(query)
      );
    }

    if (!list.length) {
      tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state-msg"><i class="bi bi-receipt"></i><p>No orders yet.<br>Customer orders will appear here once placed.</p></div></td></tr>`;
      return;
    }

    const statusOptions = ["pending", "processing", "shipped", "delivered", "cancelled"];

    tbody.innerHTML = list
      .map(
        (o) => `
      <tr data-id="${escHtml(o.id)}">
        <td><strong>${escHtml(o.id)}</strong></td>
        <td><div class="order-items-preview">${(o.items || []).map((i) => escHtml(i.name || i.productName || "Item")).join(", ")}</div></td>
        <td class="price-cell">${currency(o.total)}</td>
        <td>
          <select class="status-select" onchange="window.__admin.updateOrderStatus('${escHtml(o.id)}', this.value)">
            ${statusOptions.map((s) => `<option value="${s}" ${o.status === s ? "selected" : ""}>${s.charAt(0).toUpperCase() + s.slice(1)}</option>`).join("")}
          </select>
        </td>
        <td class="date-cell">${formatDate(o.createdAt)}</td>
        <td>
          <div class="row-actions">
            <button class="icon-action" title="View details" onclick="window.__admin.viewOrder('${escHtml(o.id)}')"><i class="bi bi-eye"></i></button>
          </div>
        </td>
      </tr>`
      )
      .join("");
  }

  async function updateOrderStatus(orderId, status) {
    try {
      await api(`/api/orders/${orderId}`, { method: "PATCH", body: JSON.stringify({ status }) });
      showSnack(`Order ${orderId} → ${status}`);
    } catch (err) {
      showSnack(err.message, "error");
      loadOrders();
    }
  }

  function viewOrder(orderId) {
    const order = state.orders.find((o) => o.id === orderId);
    if (!order) return;

    const itemsList = (order.items || [])
      .map((i) => `• ${i.name || i.productName || "Item"} × ${i.qty || i.quantity || 1} — ${currency((i.price || 0) * (i.qty || i.quantity || 1))}`)
      .join("\n");

    const details = [
      `Order: ${order.id}`,
      `Status: ${order.status}`,
      `Date: ${formatDate(order.createdAt)}`,
      ``,
      `Customer:`,
      `  ${order.customer?.name || "—"} `,
      `  ${order.customer?.email || "—"}`,
      `  ${order.customer?.phone || ""}`,
      `  ${order.customer?.address || ""}`,
      ``,
      `Items:`,
      itemsList || "(none)",
      ``,
      `Total: ${currency(order.total)}`,
    ].join("\n");

    alert(details);
  }

  /* ── SUBSCRIBERS ── */
  async function loadSubscribers() {
    try {
      const subs = await api("/api/subscribers");
      state.subscribers = subs;
      renderSubscribersTable(subs);
    } catch (err) {
      console.error("Subscribers load error:", err);
      showSnack("Failed to load subscribers", "error");
    }
  }

  function renderSubscribersTable(subs) {
    const tbody = $("#subscribersTable");
    const query = globalSearch.value.toLowerCase().trim();

    let list = [...subs].reverse();
    if (query) {
      list = list.filter((s) => s.email.toLowerCase().includes(query) || s.type.toLowerCase().includes(query));
    }

    if (!list.length) {
      tbody.innerHTML = `<tr><td colspan="3"><div class="empty-state-msg"><i class="bi bi-envelope-heart"></i><p>No subscribers yet.<br>Emails collected from the storefront will appear here.</p></div></td></tr>`;
      return;
    }

    tbody.innerHTML = list
      .map(
        (s) => `
      <tr>
        <td class="subscriber-email">${escHtml(s.email)}</td>
        <td><span class="subscriber-type ${escHtml(s.type)}">${escHtml(s.type)}</span></td>
        <td class="date-cell">${formatDate(s.createdAt)}</td>
      </tr>`
      )
      .join("");
  }

  /* ── SETTINGS ── */
  async function loadSettings() {
    try {
      const settings = await api("/api/settings");
      const form = $("#settingsForm");
      form.storeName.value = settings.storeName || "";
      form.freeShippingThreshold.value = settings.freeShippingThreshold || 0;
      form.announcement.value = settings.announcement || "";
      form.announcementSub.value = settings.announcementSub || "";
      form.weekendKitIds.value = Array.isArray(settings.weekendKitIds) ? settings.weekendKitIds.join(", ") : "";
      form.highlightProductId.value = settings.highlightProductId || "";
    } catch (err) {
      console.error("Settings load error:", err);
      showSnack("Failed to load settings", "error");
    }
  }

  async function saveSettings() {
    const form = $("#settingsForm");
    const body = {
      storeName: form.storeName.value.trim(),
      freeShippingThreshold: Number(form.freeShippingThreshold.value) || 0,
      announcement: form.announcement.value.trim(),
      announcementSub: form.announcementSub.value.trim(),
      weekendKitIds: form.weekendKitIds.value
        .split(",")
        .map((s) => Number(s.trim()))
        .filter(Boolean),
      highlightProductId: Number(form.highlightProductId.value) || null,
    };

    try {
      await api("/api/settings", { method: "PUT", body: JSON.stringify(body) });
      showSnack("Settings saved successfully");
    } catch (err) {
      showSnack(err.message || "Save failed", "error");
    }
  }

  /* ── GLOBAL SEARCH ── */
  function handleGlobalSearch() {
    const view = state.currentView;
    if (view === "products") filterAndRenderProducts();
    else if (view === "orders") renderOrdersTable(state.orders);
    else if (view === "subscribers") renderSubscribersTable(state.subscribers);
  }

  /* ── INIT & EVENT BINDING ── */
  function bindEvents() {
    // Login
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      loginError.textContent = "";
      const btn = loginForm.querySelector("button[type=submit]");
      btn.disabled = true;
      btn.innerHTML = `<span class="spinner"></span> Signing in...`;
      try {
        await login($("#loginUser").value, $("#loginPass").value);
      } catch (err) {
        loginError.textContent = err.message || "Login failed";
      } finally {
        btn.disabled = false;
        btn.textContent = "Sign in";
      }
    });

    // Logout
    logoutBtn.addEventListener("click", logout);

    // Navigation
    $$(".nav-item").forEach((btn) => {
      btn.addEventListener("click", () => switchView(btn.dataset.view));
    });

    // Sidebar toggle (mobile)
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("open");
      let overlay = document.querySelector(".sidebar-overlay");
      if (!overlay) {
        overlay = document.createElement("div");
        overlay.className = "sidebar-overlay";
        overlay.addEventListener("click", () => {
          sidebar.classList.remove("open");
          overlay.classList.remove("show");
        });
        document.body.appendChild(overlay);
      }
      overlay.classList.toggle("show", sidebar.classList.contains("open"));
    });

    // Refresh stats
    $("#refreshStats").addEventListener("click", () => {
      loadDashboard();
      showSnack("Dashboard refreshed", "info");
    });

    // Product filters
    $("#productFilter").addEventListener("change", filterAndRenderProducts);
    $("#productCategoryFilter").addEventListener("change", filterAndRenderProducts);

    // Add product
    $("#addProductBtn").addEventListener("click", () => openProductModal());

    // Product modal
    $("#closeProductModal").addEventListener("click", closeProductModal);
    $("#cancelProductModal").addEventListener("click", closeProductModal);
    $("#productForm").addEventListener("submit", saveProduct);

    // Image picker
    $("#pickImageBtn").addEventListener("click", openImagePicker);
    $("#closeImagePicker").addEventListener("click", closeImagePicker);

    // Media upload
    $("#mediaUpload").addEventListener("change", (e) => {
      const file = e.target.files?.[0];
      if (file) uploadMedia(file);
      e.target.value = "";
    });

    // Settings
    $("#saveSettingsBtn").addEventListener("click", saveSettings);

    // Global search
    let searchDebounce;
    globalSearch.addEventListener("input", () => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(handleGlobalSearch, 250);
    });

    // Close modals on backdrop click
    $("#productModal").addEventListener("click", (e) => {
      if (e.target === $("#productModal")) closeProductModal();
    });
    $("#imagePickerModal").addEventListener("click", (e) => {
      if (e.target === $("#imagePickerModal")) closeImagePicker();
    });

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeProductModal();
        closeImagePicker();
      }
    });
  }

  /* ── EXPOSE FOR INLINE HANDLERS ── */
  window.__admin = {
    editProduct(id) {
      const p = state.allProducts.find((x) => x.id === id);
      if (p) openProductModal(p);
    },
    deactivateProduct,
    restoreProduct,
    deleteMedia,
    pickImage,
    updateOrderStatus,
    viewOrder,
  };

  /* ── BOOT ── */
  async function boot() {
    bindEvents();
    const ok = await checkSession();
    if (!ok) {
      loginScreen.classList.remove("hidden");
      adminApp.classList.add("hidden");
    }
  }

  boot();
})();
