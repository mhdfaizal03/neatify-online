import React, { useState, useEffect } from 'react';
import { useCartStore } from '../../store/useCartStore';
import { getProductPlaceholderSvg } from '../../utils/placeholder';

const KNOWN_ACTUAL_IMAGES = new Set([
  'assets/product-2.jpeg',
  'assets/product-8.jpeg',
  '/assets/product-2.jpeg',
  '/assets/product-8.jpeg',
  'assets/interior-teaser.png',
  '/assets/interior-teaser.png'
]);

function getItemImage(item) {
  const img = item.image;
  if (img && (img.startsWith('data:') || img.startsWith('blob:') || img.startsWith('http://') || img.startsWith('https://'))) {
    return img;
  }
  const clean = img ? img.replace(/^\//, '') : '';
  if (clean && (KNOWN_ACTUAL_IMAGES.has(clean) || KNOWN_ACTUAL_IMAGES.has(`/${clean}`))) {
    return `/${clean}`;
  }
  return getProductPlaceholderSvg(item.name, item.type);
}

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
          <h4 className="cart-title">My Enquiry</h4>
          <button className="cart-close" onClick={() => setIsOpen(false)} aria-label="Close cart">
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        
        <div className="cart-body">
          {items.length === 0 ? (
            <div className="empty-cart-state">
              <i className="bi bi-cart-x"></i>
              <p>Your enquiry list is empty.</p>
              <button className="btn btn-primary mt-3" onClick={() => setIsOpen(false)}>Continue Shopping</button>
            </div>
          ) : (
            <div className="cart-items-container">
              {items.map(item => (
                <div className="cart-item" key={item.id}>
                  <img
                    src={getItemImage(item)}
                    alt={item.name}
                    className="cart-item-img"
                    onError={(e) => { e.currentTarget.src = getProductPlaceholderSvg(item.name, item.type); }}
                  />
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
                <span>{getCartTotal() >= 999 ? 'FREE' : '₹49'}</span>
              </div>
              <div className="summary-row total-row" style={{ fontWeight: 700, borderTop: '1px solid #e2e8f0', paddingTop: '8px', marginTop: '4px' }}>
                <span>Estimated total</span>
                <span>₹{getCartTotal() + (getCartTotal() >= 999 ? 0 : 49)}</span>
              </div>
            </div>
            <button 
              className="btn btn-lime w-100 checkout-btn d-flex align-items-center justify-content-center gap-2"
              onClick={() => {
                const checkoutModalEl = document.getElementById('checkoutModal');
                if (checkoutModalEl && window.bootstrap) {
                  setIsOpen(false);
                  const modal = window.bootstrap.Modal.getOrCreateInstance(checkoutModalEl);
                  modal.show();
                } else {
                  // Direct WhatsApp fallback
                  const waUrl = useCartStore.getState().getWhatsAppOrderUrl({
                    shipping: getCartTotal() >= 999 ? 0 : 49
                  });
                  window.open(waUrl, '_blank', 'noopener,noreferrer');
                }
              }}
              style={{ background: '#25D366', color: '#FFFFFF', border: 'none', fontWeight: 800, padding: '12px', borderRadius: '8px', marginTop: '10px' }}
            >
              <i className="bi bi-whatsapp fs-5"></i>
              <span>Send Enquiry on WhatsApp</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
