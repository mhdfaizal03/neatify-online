import React from 'react';
import '../../admin.css';

export default function Admin() {
  return (
    <>
      

  {/*  Sidebar Overlay (Mobile only)  */}
  <div className="sidebar-overlay" id="sidebarOverlay"></div>

  {/*  Login View  */}
  <div id="loginScreen" className="login-screen">
    <div className="login-card">
      <div className="login-brand">
        <span className="login-mark">N</span>
        <div>
          <h1>Neatify Admin</h1>
          <p>Sign in to manage your store</p>
        </div>
      </div>
      <form id="loginForm" novalidate>
        <label htmlFor="loginUser">Username</label>
        <input type="text" id="loginUser" placeholder="Enter username" autocomplete="username" required />

        <label htmlFor="loginPass">Password</label>
        <input type="password" id="loginPass" placeholder="••••••••" autocomplete="current-password" required />

        <button type="submit" className="btn-primary">Sign in</button>
        <p className="login-error" id="loginError"></p>
      </form>
    </div>
  </div>

  {/*  Main Application View  */}
  <div id="adminApp" className="admin-app hidden">

    {/*  Sidebar Navigation  */}
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-brand">
        <span className="brand-mark">N</span>
        <div><strong>Neatify</strong><small>Admin Console</small></div>
      </div>
      <nav className="sidebar-nav" role="navigation">
        <button className="nav-item active" data-view="dashboard"><i className="bi bi-grid-1x2-fill"></i> Dashboard</button>
        <button className="nav-item" data-view="products"><i className="bi bi-box-seam"></i> Products</button>
        <button className="nav-item" data-view="media"><i className="bi bi-images"></i> Media</button>
        <button className="nav-item" data-view="orders"><i className="bi bi-receipt"></i> Orders</button>
        <button className="nav-item" data-view="subscribers"><i className="bi bi-envelope-heart"></i> Subscribers</button>
        <button className="nav-item" data-view="settings"><i className="bi bi-gear"></i> Settings</button>
      </nav>
      <div className="sidebar-footer">
        <button id="logoutBtn" className="logout-btn"><i className="bi bi-box-arrow-right"></i> Sign out</button>
      </div>
    </aside>

    <div className="main-wrap">
      {/*  Top Header Bar  */}
      <header className="topbar">
        <button className="sidebar-toggle" id="sidebarToggle" aria-label="Toggle menu">
          <i className="bi bi-list"></i>
        </button>
        <div className="topbar-search">
          <i className="bi bi-search"></i>
          <input type="search" id="globalSearch" placeholder="Search products, orders, emails..." />
        </div>
        <div className="topbar-actions">
          <span className="admin-user" id="adminUser">admin</span>
          <span className="status-dot online" title="Status: Online"></span>
        </div>
      </header>

      {/*  Main Scrollable Content  */}
      <main className="content">

        {/*  View: Dashboard  */}
        <section className="view active" id="view-dashboard">
          <div className="page-head">
            <div>
              <h2>Dashboard</h2>
              <p>Performance overview</p>
            </div>
            <button className="btn-secondary" id="refreshStats"><i className="bi bi-arrow-clockwise"></i> Refresh</button>
          </div>
          <div className="stat-grid" id="statGrid">
            {/*  Populated by JS  */}
          </div>
          <div className="panel-grid">
            <div className="panel">
              <div className="panel-head">
                <h3>Category Breakdown</h3>
              </div>
              <div className="panel-body" id="categoryChart"></div>
            </div>
            <div className="panel">
              <div className="panel-head">
                <h3>Recent Orders</h3>
              </div>
              <div className="panel-body" id="recentOrders"></div>
            </div>
          </div>
        </section>

        {/*  View: Products  */}
        <section className="view" id="view-products">
          <div className="page-head">
            <div>
              <h2>Products</h2>
              <p>Catalog management</p>
            </div>
            <button className="btn-primary" id="addProductBtn"><i className="bi bi-plus-lg"></i> Add Product</button>
          </div>
          <div className="toolbar">
            <select id="productFilter" aria-label="Filter Status">
              <option value="active">Active products</option>
              <option value="all">All products</option>
              <option value="inactive">Inactive only</option>
            </select>
            <select id="productCategoryFilter" aria-label="Filter Category">
              <option value="">All categories</option>
              <option value="wash">Wash</option>
              <option value="tools">Tools</option>
              <option value="kit">Kits</option>
              <option value="finish">Finish</option>
            </select>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Featured</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="productsTable">
                {/*  Populated by JS  */}
              </tbody>
            </table>
          </div>
        </section>

        {/*  View: Media  */}
        <section className="view" id="view-media">
          <div className="page-head">
            <div>
              <h2>Media Library</h2>
              <p>Asset management</p>
            </div>
            <label className="btn-primary upload-btn" htmlFor="mediaUpload">
              <i className="bi bi-cloud-upload"></i> Upload Image
              <input type="file" id="mediaUpload" accept="image/*" hidden />
            </label>
          </div>
          <div className="media-grid" id="mediaGrid">
            {/*  Populated by JS  */}
          </div>
        </section>

        {/*  View: Orders  */}
        <section className="view" id="view-orders">
          <div className="page-head">
            <div>
              <h2>Orders</h2>
              <p>Manage customer orders</p>
            </div>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="ordersTable">
                {/*  Populated by JS  */}
              </tbody>
            </table>
          </div>
        </section>

        {/*  View: Subscribers  */}
        <section className="view" id="view-subscribers">
          <div className="page-head">
            <div>
              <h2>Subscribers</h2>
              <p>Marketing signups</p>
            </div>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Email Address</th>
                  <th>Type</th>
                  <th>Signup Date</th>
                </tr>
              </thead>
              <tbody id="subscribersTable">
                {/*  Populated by JS  */}
              </tbody>
            </table>
          </div>
        </section>

        {/*  View: Settings  */}
        <section className="view" id="view-settings">
          <div className="page-head">
            <div>
              <h2>Store Settings</h2>
              <p>Global configurations</p>
            </div>
            <button className="btn-primary" id="saveSettingsBtn"><i className="bi bi-check-lg"></i> Save Settings</button>
          </div>
          <form className="settings-form" id="settingsForm">
            <div className="form-grid">
              <label>Store Name
                <input type="text" name="storeName" placeholder="e.g. Neatify" />
              </label>
              <label>Free Shipping Threshold (₹)
                <input type="number" name="freeShippingThreshold" min="0" />
              </label>
              <label className="full">Announcement Bar Text
                <input type="text" name="announcement" placeholder="Main banner text" />
              </label>
              <label className="full">Announcement Subtext
                <input type="text" name="announcementSub" placeholder="Smaller banner text" />
              </label>
              <label>Weekend Kit IDs (CSV)
                <input type="text" name="weekendKitIds" placeholder="1, 2, 4, 7" />
              </label>
              <label>Featured Product ID
                <input type="number" name="highlightProductId" min="1" />
              </label>
            </div>
          </form>
        </section>
      </main>
    </div>
  </div>

  {/*  MODAL: Add/Edit Product  */}
  <div className="modal-backdrop hidden" id="productModal" role="dialog" aria-labelledby="productModalTitle">
    <div className="modal-card">
      <div className="modal-head">
        <h3 id="productModalTitle">Add Product</h3>
        <button className="icon-btn" id="closeProductModal" aria-label="Close modal"><i className="bi bi-x-lg"></i></button>
      </div>
      <form id="productForm">
        <input type="hidden" id="productId" />
        <div className="form-grid">
          <label className="full">Product Name
            <input type="text" id="productName" required />
          </label>
          <label>Category
            <select id="productCategory">
              <option value="wash">Wash</option>
              <option value="tools">Tools</option>
              <option value="kit">Kit</option>
              <option value="finish">Finish</option>
            </select>
          </label>
          <label>Short Type (Label)
            <input type="text" id="productType" placeholder="e.g. SHAMPOO" />
          </label>
          <label>Price (₹)
            <input type="number" id="productPrice" min="0" required />
          </label>
          <label>Display Order
            <input type="number" id="productFeatured" min="1" value="1" />
          </label>
          <label>Display Badge
            <input type="text" id="productBadge" placeholder="e.g. NEW" />
          </label>
          <label className="full">Main Image
            <div className="image-picker">
              <input type="text" id="productImage" placeholder="Upload or enter URL" required />
              <button type="button" className="btn-secondary" id="pickImageBtn">Browse</button>
            </div>
          </label>
          <label className="full">Long Description
            <textarea id="productDescription" rows="3"></textarea>
          </label>
          <label className="full">Bullet Points (One per line)
            <textarea id="productPoints" rows="4" placeholder="Deep cleaning formula&#10;pH Neutral"></textarea>
          </label>
          <label className="checkbox-label">
            <input type="checkbox" id="productActive" checked />
            <span>Show on Storefront</span>
          </label>
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-secondary" id="cancelProductModal">Cancel</button>
          <button type="submit" className="btn-primary">Save Product</button>
        </div>
      </form>
    </div>
  </div>

  {/*  MODAL: Media Picker  */}
  <div className="modal-backdrop hidden" id="imagePickerModal" role="dialog">
    <div className="modal-card wide">
      <div className="modal-head">
        <h3>Select Asset</h3>
        <button className="icon-btn" id="closeImagePicker" aria-label="Close picker"><i className="bi bi-x-lg"></i></button>
      </div>
      <div className="media-grid compact" id="pickerGrid">
        {/*  Media items injected here  */}
      </div>
    </div>
  </div>

  {/*  MODAL: Order Details  */}
  <div className="modal-backdrop hidden" id="orderModal" role="dialog" aria-labelledby="orderModalTitle">
    <div className="modal-card">
      <div className="modal-head">
        <h3 id="orderModalTitle">Order Details</h3>
        <button className="icon-btn" id="closeOrderModal" aria-label="Close modal"><i className="bi bi-x-lg"></i></button>
      </div>
      <form id="orderForm">
        <input type="hidden" id="orderId" />
        <div className="form-grid">
          <label className="full">Order Info
            <div id="orderInfoDisplay" style={{"padding":"10px","background":"var(--bg-alt)","borderRadius":"6px","fontSize":"0.9em"}}>
              {/*  Populated by JS  */}
            </div>
          </label>
          <label>Status
            <select id="orderStatus">
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-secondary" id="cancelOrderModal">Cancel</button>
          <button type="submit" className="btn-primary">Update Status</button>
        </div>
      </form>
    </div>
  </div>

  {/*  Global Snackbar  */}
  <div className="snackbar hidden" id="snackbar" aria-live="polite"></div>

  {/*  Admin Application Scripts  */}
  

    </>
  );
}
