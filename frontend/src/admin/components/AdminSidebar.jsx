import React from 'react';

export default function AdminSidebar() {
  return (
    <>
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

    
    </>
  );
}
