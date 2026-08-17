import { useEffect } from 'react';

export function useAdminLogic() {
  useEffect(() => {
    let rafId = null;

    // --- PASTE VANILLA LOGIC ---
    /* ═══════════════════════════════════════════════
   NEATIFY ADMIN DASHBOARD — Application Logic
   ═══════════════════════════════════════════════ */

(() => {
  "use strict";

  const state = {
    token: localStorage.getItem("neatify_token") || null,
    currentView: "dashboard",
    allProducts: [],
    categories: [],
    orders: [],
    subscribers: [],
    media: [],
    settings: {},
    stats: null,
    editingProduct: null,
  };

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const snackbar = $("#snackbar");

  /* ── API HELPER ── */
  async function api(path, opts = {}) {
    const headers = { "Content-Type": "application/json", ...(opts.headers || {}) };
    if (state.token) headers.Authorization = `Bearer ${state.token}`;
    if (opts.body instanceof FormData) delete headers["Content-Type"];

    try {
      const res = await fetch(path, { ...opts, headers });

      if (res.status === 401) {
        logout();
        throw new Error("Session expired");
      }

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (!res.ok) throw new Error(data.error || "Request failed");
      return data;
    } catch (err) {
      console.error(`API Error (${path}):`, err);
      throw err;
    }
  }

  /* ── UTILS ── */
  const currency = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");
  const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' }) : "—";

  function esc(str) {
    const d = document.createElement("div");
    d.textContent = str == null ? "" : String(str);
    return d.innerHTML;
  }

  function showSnack(msg, type = "success") {
    snackbar.textContent = msg;
    snackbar.className = `snackbar ${type} show`;
    setTimeout(() => snackbar.classList.remove("show"), 3000);
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
    $("#loginScreen").classList.remove("hidden");
    $("#mainApp").classList.add("hidden");
  }

  function showApp(username) {
    $("#loginScreen").classList.add("hidden");
    $("#mainApp").classList.remove("hidden");
    $("#adminUser").textContent = username || "admin";
    initAppEventListeners();
    switchView("dashboard");
  }

  /* ── NAVIGATION ── */
  function switchView(viewName) {
    state.currentView = viewName;
    // Reset search when switching views
    const searchInput = $("#globalSearch");
    if (searchInput.value) {
      searchInput.value = "";
    }

    // Update search placeholder
    const placeholders = {
      products: "Search products...",
      categories: "Search categories...",
      orders: "Search by order ID, customer name, or email...",
      subscribers: "Search by email address...",
      media: "Search by filename...",
      dashboard: "Search...",
      settings: "Search...",
    };
    searchInput.placeholder = placeholders[viewName] || "Search...";
    searchInput.disabled = !placeholders[viewName] || viewName === 'dashboard' || viewName === 'settings';

    // Load data for the new view
    loadViewData(viewName);

    // Update UI
    $$(".nav-item").forEach(btn => btn.classList.toggle("active", btn.dataset.view === viewName));
    $$(".view").forEach(v => v.classList.remove("active"));
    $(`#view-${viewName}`).classList.add("active");

    // Close sidebar on mobile
    $("#sidebar").classList.remove("open");
    $(".sidebar-overlay")?.classList.remove("show");

  }

  function loadViewData(viewName) {
    const loaders = {
      dashboard: loadDashboard,
      products: loadProducts,
      categories: loadCategories,
      media: loadMedia,
      orders: loadOrders,
      subscribers: loadSubscribers,
      settings: loadSettings
    };
    if (loaders[viewName]) loaders[viewName]();

  }

  /* ── VIEW LOGIC: DASHBOARD ── */
  async function loadDashboard() {
    try {
      const s = await api("/api/stats");
      $("#statGrid").innerHTML = `
        <div class="stat-card"><div class="stat-icon green"><i class="bi bi-box-seam"></i></div><div class="stat-value">${s.totalProducts}</div><div class="stat-label">Products</div></div>
        <div class="stat-card"><div class="stat-icon blue"><i class="bi bi-receipt"></i></div><div class="stat-value">${s.totalOrders}</div><div class="stat-label">Orders</div></div>
        <div class="stat-card"><div class="stat-icon yellow"><i class="bi bi-currency-rupee"></i></div><div class="stat-value">${currency(s.totalRevenue)}</div><div class="stat-label">Revenue</div></div>
        <div class="stat-card"><div class="stat-icon pink"><i class="bi bi-envelope-heart"></i></div><div class="stat-value">${s.totalSubscribers}</div><div class="stat-label">Subscribers</div></div>
      `;
      // Render category chart bars
      const catChart = $("#categoryChart");
      if (catChart) {
        catChart.innerHTML = Object.entries(s.categoryCounts).map(([cat, count]) => `
          <div class="cat-bar-row">
              <span class="cat-bar-label">${cat}</span>
              <div class="cat-bar-track"><div class="cat-bar-fill" style="width:${(count / s.totalProducts) * 100}%"></div></div>
              <span class="cat-bar-count">${count}</span>
          </div>
        `).join("");
      }
      // Render recent orders
      const recentEl = $("#recentOrders");
      if (recentEl) {
        recentEl.innerHTML = s.recentOrders.length ? `
          <div class="table-wrap minimal">
            <table class="data-table">
              <thead><tr><th>ID</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
              <tbody>
                ${s.recentOrders.map(o => `<tr><td><a href="#" onclick="window.__admin.switchView('orders'); return false;">${o.id}</a></td><td>${esc(o.customer.name || o.customer.email)}</td><td class="price-cell">${currency(o.total)}</td><td><span class="status-badge ${esc(o.status)}">${esc(o.status)}</span></td></tr>`).join("")}
              </tbody>
            </table>
          </div>` : `<div class="panel-empty">No recent orders</div>`;
      }
    } catch (err) { showSnack("Failed to load stats", "error"); }
  }

  /* ── VIEW LOGIC: PRODUCTS ── */
  async function loadProducts() {
    const tbody = $("#productsTable");
    tbody.innerHTML = `<tr><td colspan="6" class="loading-overlay"><span class="spinner"></span> Loading...</td></tr>`;
    try {
      if (state.categories.length === 0) {
        await loadCategories();
      }
      state.allProducts = await api("/api/products/all");
      renderProductsTable();
    } catch (err) { showSnack("Failed to load products", "error"); }
  }

  function renderProductsTable() {
    const tbody = $("#productsTable");
    const filter = $("#productFilter").value;
    const cat = $("#productCategoryFilter").value;
    const search = $("#globalSearch").value.toLowerCase().trim();

    let list = state.allProducts.filter(p => {
      const matchesFilter = filter === 'all' || (filter === 'active' && p.active !== false) || (filter === 'inactive' && p.active === false);
      const matchesCat = !cat || p.category === cat;
      const matchesSearch = p.name.toLowerCase().includes(search);
      return matchesFilter && matchesCat && matchesSearch;
    });

    if (!list.length) {
      tbody.innerHTML = `<tr><td colspan="6"><div class="admin-empty-state"><i class="bi bi-box-seam"></i><h4>No products found</h4><p>Try adjusting your search or filters.</p></div></td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(p => `
      <tr>
        <td><div class="product-cell"><img src="/${esc(p.image)}" class="product-thumb" alt=""><div><div class="product-name">${esc(p.name)}</div></div></div></td>
        <td>${esc(p.category)}</td>
        <td class="price-cell">${currency(p.price)}</td>
        <td>${p.stock === 0 ? '<span class="status-badge cancelled">Sold Out</span>' : (p.stock < 5 ? `<span class="status-badge pending">Low: ${p.stock}</span>` : p.stock)}</td>
        <td>${p.featured || 0}</td>
        <td><span class="status-badge ${p.active !== false ? 'active' : 'inactive'}">${p.active !== false ? 'Active' : 'Inactive'}</span></td>
        <td>
          <div class="row-actions">
            <button class="icon-action" onclick="window.__admin.editProduct(${p.id})"><i class="bi bi-pencil"></i></button>
            ${p.active !== false
              ? `<button class="icon-action danger" onclick="window.__admin.deleteProduct(${p.id})"><i class="bi bi-trash"></i></button>`
              : `<button class="icon-action restore" onclick="window.__admin.restoreProduct(${p.id})"><i class="bi bi-arrow-counterclockwise"></i></button>`}
          </div>
        </td>
      </tr>
    `).join("");
  }

  /* ── PRODUCT MODAL ── */
  async function saveProduct(e) {
    e.preventDefault();
    const id = $("#productId").value;
    const payload = {
      name: $("#productName").value,
      category: $("#productCategory").value,
      type: $("#productType").value,
      price: Number($("#productPrice").value),
      stock: Number($("#productStock").value),
      featured: Number($("#productFeatured").value),
      image: $("#productImage").value,
      badge: $("#productBadge").value,
      description: $("#productDescription").value,
      active: $("#productActive").checked,
      isKit: $("#productIsKit").checked,
      points: $("#productPoints").value.split("\n").filter(l => l.trim() !== "")
    };

    try {
      const method = id ? "PUT" : "POST";
      const url = id ? `/api/products/${id}` : "/api/products";
      await api(url, { method, body: JSON.stringify(payload) });
      showSnack(id ? "Product updated" : "Product created");
      $("#productModal").classList.add("hidden");
      loadProducts();
    } catch (err) { showSnack("Save failed", "error"); }
  }

  /* ── VIEW LOGIC: MEDIA ── */
  async function loadMedia() {
    const grid = $("#mediaGrid");
    grid.innerHTML = `<div class="loading-overlay"><span class="spinner"></span> Loading...</div>`;
    try {
      state.media = await api("/api/media");
      renderMediaGrid();
    } catch (err) { showSnack("Failed to load media", "error"); }
  }

  function renderMediaGrid() {
    const grid = $("#mediaGrid");
    const picker = $("#pickerGrid");
    const search = $("#globalSearch").value.toLowerCase().trim();
    const list = state.media.filter(m => m.name.toLowerCase().includes(search));

    const renderItem = m => `
      <div class="media-card">
        <img src="/${esc(m.url)}" alt="${esc(m.name)}" loading="lazy" onclick="window.__admin.pickImage('${esc(m.url)}')">
        <div class="media-info">
          <span class="media-name">${esc(m.name)}</span>
          <span class="media-meta">${(m.size / 1024).toFixed(1)} KB</span>
        </div>
        <div class="media-actions">
          <button class="icon-action" onclick="window.__admin.pickImage('${esc(m.url)}')" title="Use Image"><i class="bi bi-check2-circle"></i></button>
          ${m.source === 'upload' ? `<button class="icon-action danger" onclick="window.__admin.deleteMedia('${esc(m.url)}')" title="Delete"><i class="bi bi-trash"></i></button>` : ''}
        </div>
      </div>`;

    grid.innerHTML = list.length ? list.map(renderItem).join("") : `<div class="admin-empty-state"><i class="bi bi-images"></i><h4>No media found</h4><p>Upload new images or adjust your search.</p></div>`;
    if (picker) picker.innerHTML = list.length ? list.map(renderItem).join("") : `<div class="admin-empty-state"><i class="bi bi-images"></i><h4>No media found</h4><p>Upload new images or adjust your search.</p></div>`;
  }

  async function uploadMedia(file) {
    if (!file) return;
    const btn = document.querySelector("label[for=mediaUpload]");
    const originalText = btn.innerHTML;
    btn.innerHTML = `<i class="bi bi-cloud-upload"></i> Uploading...`;
    btn.disabled = true;

    const formData = new FormData();
    formData.append("image", file);
    try {
      await api("/api/media/upload", { method: "POST", body: formData });
      showSnack("Image uploaded");
      if (state.currentView === 'media') loadMedia();
    } catch (err) {
      showSnack(err.message || "Upload failed", "error");
    } finally {
      btn.innerHTML = originalText;
      btn.disabled = false;
      $("#mediaUpload").value = "";
    }
  }

  /* ── VIEW LOGIC: ORDERS ── */
  async function loadOrders() {
    const tbody = $("#ordersTable");
    tbody.innerHTML = `<tr><td colspan="6" class="loading-overlay"><span class="spinner"></span> Loading...</td></tr>`;
    try {
      state.orders = await api("/api/orders");
      renderOrdersTable();
    } catch (err) { showSnack("Failed to load orders", "error"); }
  }

  function renderOrdersTable() {
    const tbody = $("#ordersTable");
    const search = $("#globalSearch").value.toLowerCase().trim();
    const list = state.orders
      .filter(o => o.id.toLowerCase().includes(search) || (o.customer.name || "").toLowerCase().includes(search) || (o.customer.email || "").toLowerCase().includes(search))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (!list.length) {
      tbody.innerHTML = `<tr><td colspan="6"><div class="admin-empty-state"><i class="bi bi-receipt"></i><h4>No orders found</h4><p>There are no orders matching your search.</p></div></td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(o => `
      <tr>
        <td>${esc(o.id)}</td>
        <td>${o.items.length} item(s)</td>
        <td class="price-cell">${currency(o.total)}</td>
        <td><span class="status-badge ${esc(o.status)}">${esc(o.status)}</span></td>
        <td>${formatDate(o.createdAt)}</td>
        <td>
          <div class="row-actions">
            <button class="icon-action" onclick="window.__admin.editOrder('${esc(o.id)}')" title="View/Edit Order"><i class="bi bi-pencil"></i></button>
          </div>
        </td>
      </tr>`).join("");
  }

  /* ── VIEW LOGIC: SUBSCRIBERS ── */
  async function loadSubscribers() {
    const tbody = $("#subscribersTable");
    tbody.innerHTML = `<tr><td colspan="3" class="loading-overlay"><span class="spinner"></span> Loading...</td></tr>`;
    try {
      state.subscribers = await api("/api/subscribers");
      renderSubscribersTable();
    } catch (err) { showSnack("Failed to load subscribers", "error"); }
  }

  function renderSubscribersTable() {
    const tbody = $("#subscribersTable");
    const search = $("#globalSearch").value.toLowerCase().trim();
    const list = state.subscribers.filter(s => s.email.toLowerCase().includes(search))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (!list.length) {
      tbody.innerHTML = `<tr><td colspan="3"><div class="admin-empty-state"><i class="bi bi-envelope-heart"></i><h4>No subscribers found</h4><p>There are no subscribers matching your search.</p></div></td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(s => `
      <tr>
        <td>${esc(s.email)}</td>
        <td><span class="status-badge neutral">${esc(s.type)}</span></td>
        <td>${formatDate(s.createdAt)}</td>
      </tr>`).join("");
  }

  /* ── VIEW LOGIC: SETTINGS ── */
  async function loadSettings() {
    try {
      state.settings = await api("/api/settings");
      const form = $("#settingsForm");
      Object.entries(state.settings).forEach(([key, value]) => {
        const input = form.elements[key];
        if (input) {
          input.value = Array.isArray(value)
            ? value.join(", ")
            : (value !== null && value !== undefined ? value : "");
        }
      });
    } catch (err) { showSnack("Failed to load settings", "error"); }
  }

  async function saveSettings(e) {
    e.preventDefault();
    const form = $("#settingsForm");
    const payload = {};
    const data = new FormData(form);
    for (const [key, value] of data.entries()) {
      if (key === 'weekendKitIds') payload[key] = value.split(',').map(s => Number(s.trim())).filter(Boolean);
      else if (key === 'marqueeKeywords') payload[key] = value.split(',').map(s => s.trim()).filter(Boolean);
      else if (form.elements[key].type === 'number') payload[key] = Number(value);
      else payload[key] = value;
    }
    try {
      await api("/api/settings", { method: "PUT", body: JSON.stringify(payload) });
      showSnack("Settings saved");
    } catch (err) { showSnack("Save failed", "error"); }
  }

  /* ── VIEW LOGIC: CATEGORIES ── */
  async function loadCategories() {
    try {
      state.categories = await api("/api/categories");
      renderCategoriesTable();

      // Populate Product Form Category selector
      const select = $("#productCategory");
      if (select) {
        select.innerHTML = state.categories.map(c => `
          <option value="${c.id}">${c.name}</option>
        `).join("");
      }

      // Populate Product Filter category selector
      const filterSelect = $("#productCategoryFilter");
      if (filterSelect) {
        const val = filterSelect.value;
        filterSelect.innerHTML = `
          <option value="">All categories</option>
          ${state.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join("")}
        `;
        filterSelect.value = val;
      }
    } catch (err) {
      showSnack("Failed to load categories", "error");
    }
  }

  async function createCategory(e) {
    e.preventDefault();
    const id = $("#categoryId").value;
    const name = $("#categoryName").value;
    try {
      await api("/api/categories", {
        method: "POST",
        body: JSON.stringify({ id, name }),
      });
      showSnack("Category created");
      $("#categoryForm").reset();
      await loadCategories();
    } catch (err) {
      showSnack(err.message || "Failed to create category", "error");
    }
  }

  async function deleteCategory(id) {
    if (!confirm(`Are you sure you want to delete category "${id}"?`)) return;
    try {
      await api(`/api/categories/${id}`, { method: "DELETE" });
      showSnack("Category deleted");
      await loadCategories();
    } catch (err) {
      showSnack(err.message || "Failed to delete category", "error");
    }
  }

  function renderCategoriesTable() {
    const tbody = $("#categoriesTable");
    if (!tbody) return;

    const query = $("#globalSearch")?.value?.toLowerCase() || "";
    const filtered = state.categories.filter(c => 
      c.id.toLowerCase().includes(query) || 
      c.name.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="3" class="text-center">No categories found</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(c => `
      <tr>
        <td><code>${c.id}</code></td>
        <td><strong>${c.name}</strong></td>
        <td>
          <button class="icon-btn delete-btn" data-id="${c.id}" aria-label="Delete category">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `).join("");

    tbody.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", () => deleteCategory(btn.dataset.id));
    });
  }

  /* ── EXPOSE GLOBALS ── */
  window.__admin = {
    switchView,
    editOrder: (id) => {
      const o = state.orders.find(x => x.id === id);
      if (!o) return;
      $("#orderId").value = o.id;
      $("#orderStatus").value = o.status || "pending";
      $("#orderInfoDisplay").innerHTML = `
        <strong>Customer:</strong> ${esc(o.customer?.name || o.customer?.email)}<br>
        <strong>Email:</strong> ${esc(o.customer?.email)}<br>
        <strong>Total:</strong> ${currency(o.total)}<br>
        <strong>Date:</strong> ${formatDate(o.createdAt)}<br>
        <strong>Items:</strong><br>
        ${(o.items || []).map(i => `- ${esc(i.name)} (x${i.quantity})`).join('<br>')}
      `;
      $("#orderModal").classList.remove("hidden");
    },
    editProduct: (id) => {
      const p = state.allProducts.find(x => x.id === id);
      if (!p) return;
      $("#productId").value = p.id;
      $("#productName").value = p.name;
      $("#productCategory").value = p.category;
      $("#productType").value = p.type || "";
      $("#productPrice").value = p.price;
      $("#productStock").value = p.stock !== undefined ? p.stock : 20;
      $("#productFeatured").value = p.featured || p.id;
      $("#productBadge").value = p.badge || "";
      $("#productImage").value = p.image;
      $("#productDescription").value = p.description || "";
      $("#productPoints").value = (p.points || []).join("\n");
      $("#productActive").checked = p.active !== false;
      $("#productIsKit").checked = p.isKit === true;
      $("#productModalTitle").textContent = "Edit Product";
      $("#productModal").classList.remove("hidden");
    },
    deleteProduct: async (id) => {
      if (!confirm("Are you sure you want to archive this product? It will be hidden from the storefront.")) return;
      await api(`/api/products/${id}`, { method: "DELETE" });
      loadProducts();
      showSnack("Product archived", "info");
    },
    restoreProduct: async (id) => {
      if (!confirm("Restore this product? It will be visible on the storefront again.")) return;
      await api(`/api/products/${id}/restore`, { method: "PATCH" });
      loadProducts();
      showSnack("Product restored", "success");
    },
    pickImage: (url) => {
      $("#productImage").value = url;
      $("#imagePickerModal").classList.add("hidden");
    },
    deleteMedia: async (url) => {
      if (!confirm("Are you sure you want to permanently delete this file? This cannot be undone.")) return;
      try {
        await api("/api/media", { method: "DELETE", body: JSON.stringify({ url }) });
        loadMedia();
        showSnack("File deleted", "info");
      } catch (err) {
        showSnack(err.message || "Could not delete file.", "error");
      }
    }
  };

  /* ── EVENT LISTENERS ── */
  let listenersInitialized = false;
  function initAppEventListeners() {
    if (listenersInitialized) return;

    $("#logoutBtn").addEventListener("click", logout);

    $$(".nav-item").forEach(btn => btn.addEventListener("click", () => switchView(btn.dataset.view)));

    $("#sidebarToggle").addEventListener("click", () => {
      $("#sidebar").classList.toggle("open");
      $(".sidebar-overlay")?.classList.toggle("show");
    });
    $("#sidebarOverlay").addEventListener("click", () => {
      $("#sidebar").classList.remove("open");
      $(".sidebar-overlay")?.classList.remove("show");
    });

    $("#globalSearch").addEventListener("input", () => {
      const view = state.currentView;
      if (view === 'products') renderProductsTable();
      else if (view === 'categories') renderCategoriesTable();
      else if (view === 'orders') renderOrdersTable();
      else if (view === 'subscribers') renderSubscribersTable();
      else if (view === 'media') renderMediaGrid();
    });

    $("#refreshStats").addEventListener("click", loadDashboard);

    $("#addProductBtn").addEventListener("click", () => {
      $("#productForm").reset();
      $("#productId").value = "";
      $("#productStock").value = 20;
      $("#productModalTitle").textContent = "Add Product";
      $("#productModal").classList.remove("hidden");
    });

    $("#productForm").addEventListener("submit", saveProduct);

    $("#orderForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = $("#orderId").value;
      const status = $("#orderStatus").value;
      try {
        await api(`/api/orders/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
        showSnack("Order updated");
        $("#orderModal").classList.add("hidden");
        loadOrders();
      } catch (err) { showSnack("Update failed", "error"); }
    });

    $("#pickImageBtn").addEventListener("click", () => {
      loadMedia(); // Ensure picker is up-to-date
      $("#imagePickerModal").classList.remove("hidden");
    });
    $("#closeProductModal, #cancelProductModal").addEventListener("click", () => $("#productModal").classList.add("hidden"));
    $("#closeOrderModal, #cancelOrderModal").addEventListener("click", () => $("#orderModal").classList.add("hidden"));
    $("#closeImagePicker").addEventListener("click", () => $("#imagePickerModal").classList.add("hidden"));

    $("#mediaUpload").addEventListener("change", (e) => uploadMedia(e.target.files[0]));

    $("#saveSettingsBtn").addEventListener("click", saveSettings);
    $("#settingsForm").addEventListener("submit", saveSettings);

    const catForm = $("#categoryForm");
    if (catForm) {
      catForm.addEventListener("submit", createCategory);
    }

    listenersInitialized = true;
  }

  // Check Session
  if (state.token) showApp();
  else {
    // Only login listener is needed initially
    $("#loginForm").addEventListener("submit", async e => {
      e.preventDefault();
      const errEl = $("#loginError");
      if (errEl) {
        errEl.style.display = "none";
        errEl.textContent = "";
      }
      try {
        await login($("#loginUser").value, $("#loginPass").value);
      } catch (err) {
        if (errEl) {
          errEl.textContent = err.message || "Invalid credentials";
          errEl.style.display = "block";
        }
      }
    });
  }

})();
    // --- END VANILLA LOGIC ---

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);
}
