import React from 'react';

export default function AdminTopbar() {
  return (
    <>
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
    </>
  );
}
