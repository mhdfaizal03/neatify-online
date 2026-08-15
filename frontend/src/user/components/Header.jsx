import React from 'react';
import { useCartStore } from '../../store/useCartStore';

export default function Header() {
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const openCart = () => {
    window.dispatchEvent(new Event('openCart'));
  };

  return (
    <>
      
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

      <button className="nav-burger" type="button" id="navBurger" aria-controls="navDrawer" aria-expanded="false"
        aria-label="Open menu">
        <i className="bi bi-list"></i>
      </button>
    </div>
  </nav>
    </>
  );
}
