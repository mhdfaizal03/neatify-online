import React from 'react';

export default function Header() {
  return (
    <>
      <div className="ann-pop" id="annPop" role="dialog" aria-live="polite" aria-label="Store announcement">
    <span className="ann-dot"></span>
    <div className="ann-pop-copy">
      <strong id="announceMain">Premium vehicle care, made simple.</strong>
      <span id="announceSub">Free shipping on orders above ₹999.</span>
    </div>
    <button className="ann-pop-x" id="annPopClose" aria-label="Dismiss announcement"><i className="bi bi-x-lg"></i></button>
  </div>

  
  <nav className="navbar navbar-expand-lg" id="mainNav">
    <div className="container">
      <a className="nav-brand" href="#home" aria-label="Neatify">
        <span className="brand-text">Neatify</span>
        <span className="brand-accent">.</span>
      </a>

      <div className="collapse navbar-collapse" id="navMenu">
        <ul className="navbar-nav mx-auto gap-1">
          <li className="nav-item"><a className="nav-link active" href="#home">Home</a></li>
          <li className="nav-item"><a className="nav-link" href="#shop">Shop</a></li>
          <li className="nav-item"><a className="nav-link" href="#how-it-works">Process</a></li>
          <li className="nav-item"><a className="nav-link" href="#story">About</a></li>
          <li className="nav-item"><a className="nav-link" href="#faq">FAQ</a></li>
        </ul>
      </div>

      <div className="nav-end d-flex align-items-center gap-2">
        <button className="icon-btn" id="searchToggle" aria-label="Search">
          <i className="bi bi-search"></i>
        </button>
        <button className="icon-btn" id="accountBtn" aria-label="Account">
          <i className="bi bi-person-circle" id="accountIcon"></i>
        </button>
        <button className="icon-btn cart-btn" id="cartToggle" aria-label="Cart">
          <i className="bi bi-bag"></i>
          <span className="cart-badge" id="cartCount">0</span>
        </button>
        <a className="btn-primary-sm d-none d-lg-inline-flex" href="#shop">Shop Now</a>
      </div>

      <button className="nav-burger" type="button" id="navBurger" aria-controls="navDrawer" aria-expanded="false" aria-label="Open menu">
        <i className="bi bi-list"></i>
      </button>
    </div>
  </nav>

  
  <div className="nav-scrim" id="navScrim"></div>
  <aside className="nav-drawer" id="navDrawer" aria-hidden="true">
    <div className="nav-drawer-head">
      <span className="drawer-brand">Neatify<span className="brand-accent">.</span></span>
      <button className="ann-pop-x" id="navDrawerClose" aria-label="Close menu"><i className="bi bi-x-lg"></i></button>
    </div>
    <nav className="nav-drawer-links" aria-label="Mobile navigation">
      <a href="#home" className="drawer-link active">Home</a>
      <a href="#shop" className="drawer-link">Shop</a>
      <a href="#how-it-works" className="drawer-link">Process</a>
      <a href="#story" className="drawer-link">About</a>
      <a href="#faq" className="drawer-link">FAQ</a>
    </nav>
    <div className="nav-drawer-foot">
      <a className="btn-primary-sm" href="#shop">Shop Now</a>
      <p className="drawer-note">Premium vehicle care, made simple.</p>
    </div>
  </aside>

  
  <div className="search-bar" id="searchPanel">
    <div className="container py-3">
      <div className="search-field">
        <i className="bi bi-search"></i>
        <input id="searchInput" type="search" placeholder="Search products…" autoComplete="off" aria-label="Search" />
        <button className="icon-btn" id="searchClose"><i className="bi bi-x-lg"></i></button>
      </div>
      <div id="searchResults" className="search-drop" role="listbox" aria-live="polite"></div>
    </div>
  </div>
    </>
  );
}
