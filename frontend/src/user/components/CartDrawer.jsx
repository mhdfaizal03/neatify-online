import React, { useState, useEffect } from 'react';
import { useCartStore } from '../../store/useCartStore';

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, updateQty, removeItem, getCartTotal } = useCartStore();

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('openCart', handleOpen);
    return () => window.removeEventListener('openCart', handleOpen);
  }, []);

  return (
    <>
      <div className={`cart-overlay ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(false)}></div>
      <div className={`cart-panel ${isOpen ? 'active' : ''}`}>
        <div className="cart-header">
          <h4 className="cart-title">Your Cart</h4>
          <button className="cart-close" onClick={() => setIsOpen(false)} aria-label="Close cart">
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        
        <div className="cart-body">
          {items.length === 0 ? (
            <div className="empty-cart-state">
              <i className="bi bi-cart-x"></i>
              <p>Your cart is empty.</p>
              <button className="btn btn-primary mt-3" onClick={() => setIsOpen(false)}>Continue Shopping</button>
            </div>
          ) : (
            <div className="cart-items-container">
              {items.map(item => (
                <div className="cart-item" key={item.id}>
                  <img src={item.image || "/assets/placeholder.png"} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-info">
                    <h5 className="cart-item-title">{item.name}</h5>
                    <div className="cart-item-price">₹{item.price}</div>
                    <div className="cart-item-controls">
                      <div className="qty-selector">
                        <button className="qty-btn minus" onClick={() => updateQty(item.id, item.qty - 1)}>-</button>
                        <span className="qty-input">{item.qty}</span>
                        <button className="qty-btn plus" onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                      </div>
                      <button className="item-remove" onClick={() => removeItem(item.id)}><i className="bi bi-trash"></i></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{getCartTotal()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>
            <button className="btn btn-primary w-100 checkout-btn">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
