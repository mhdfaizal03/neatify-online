import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Modals from '../components/Modals';
import { useStorefrontLogic } from '../hooks/useStorefrontLogic';
import {
  buildWhatsAppUrl,
  buildProductInquiryMessage,
  buildProductShareText,
  shareToWhatsApp
} from '../../utils/whatsapp';
import { getProductPlaceholderSvg } from '../../utils/placeholder';

const KNOWN_ACTUAL_IMAGES = new Set([
  'assets/product-2.jpeg',
  'assets/product-8.jpeg',
  '/assets/product-2.jpeg',
  '/assets/product-8.jpeg',
  'assets/interior-teaser.png',
  '/assets/interior-teaser.png'
]);

const getImageUrl = (img, p = {}) => {
  if (img && (img.startsWith('data:') || img.startsWith('blob:') || img.startsWith('http://') || img.startsWith('https://'))) {
    return img;
  }
  const clean = img ? img.replace(/^\//, '') : '';
  if (clean && (KNOWN_ACTUAL_IMAGES.has(clean) || KNOWN_ACTUAL_IMAGES.has(`/${clean}`))) {
    return `/${clean}`;
  }
  return getProductPlaceholderSvg(p?.name || 'Neatify Product', p?.type || p?.category || 'Vehicle Care');
};

export default function ProductDetails() {
  useStorefrontLogic();
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [includedItems, setIncludedItems] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // Scroll to top on navigation
    window.scrollTo(0, 0);

    async function fetchProduct() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);

        // Fetch included products if it's a kit/set
        if (data.isKit && data.includedProducts && data.includedProducts.length > 0) {
          const allRes = await fetch('/api/products');
          if (allRes.ok) {
            const allProducts = await allRes.json();
            const included = allProducts.filter(p =>
              data.includedProducts.map(String).includes(String(p.id))
            );
            setIncludedItems(included);
          }
        }
      } catch (err) {
        console.error(err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const activeImage = selectedImage && product?.images?.includes(selectedImage)
    ? selectedImage
    : (product?.images && product.images.length > 0 ? product.images[0] : (product?.image || ''));

  const handleAddToCart = () => {
    if (!product) return;
    if (typeof window.addToCart === 'function') {
      // Add the selected quantity to the enquiry list
      for (let i = 0; i < quantity - 1; i++) {
        window.addToCart(product.id);
      }
      // Show drawer on the last addition
      window.addToCart(product.id, true);
    } else {
      try {
        const saved = JSON.parse(localStorage.getItem('neatify-cart-v2') || '[]');
        const found = saved.find(i => String(i.id) === String(product.id));
        if (found) {
          found.qty += quantity;
        } else {
          saved.push({ id: product.id, qty: quantity });
        }
        localStorage.setItem('neatify-cart-v2', JSON.stringify(saved));
        if (typeof window.renderCart === 'function') window.renderCart();
      } catch (e) {
        console.error('Cart fallback error:', e);
      }
    }
  };

  const handleDirectOrder = () => {
    if (!product) return;
    try {
      const raw = localStorage.getItem('neatify-cart-v2');
      let cart = raw ? JSON.parse(raw) : [];
      const existing = cart.find(it => String(it.id) === String(product.id));
      if (existing) {
        existing.qty = Math.max(1, quantity);
      } else {
        cart.push({ id: product.id, qty: quantity });
      }
      localStorage.setItem('neatify-cart-v2', JSON.stringify(cart));
      if (typeof window.renderCart === 'function') window.renderCart();
      if (typeof window.openCheckout === 'function') {
        window.openCheckout();
      } else if (window.bootstrap) {
        const modalEl = document.getElementById('checkoutModal');
        if (modalEl) {
          const bsModal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
          bsModal.show();
        }
      }
    } catch (e) {
      console.error('Direct order error:', e);
    }
  };

  const incrementQty = () => {
    setQuantity(prev => {
      if (product && prev >= product.stock) return prev;
      return prev + 1;
    });
  };

  const decrementQty = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  return (
    <>
      <Header />
      <main id="productPage" style={{ minHeight: '80vh' }}>
        <section className="product-detail-sec">
          <div className="container">
            {/* Breadcrumb & Back action bar */}
            <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
              <nav aria-label="breadcrumb" className="mb-0">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to="/" className="text-decoration-none" style={{ color: '#1e293b', fontWeight: 600 }}>Home</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <a href="/#shop" className="text-decoration-none" style={{ color: '#1e293b', fontWeight: 600 }}>Shop</a>
                  </li>
                  <li className="breadcrumb-item active" id="breadcrumbName" aria-current="page" style={{ color: '#6e7872' }}>
                    {loading ? 'Loading...' : (product ? product.name : 'Product not found')}
                  </li>
                </ol>
              </nav>
              <button
                type="button"
                onClick={() => {
                  if (window.history.length > 1) {
                    navigate(-1);
                  } else {
                    navigate('/');
                  }
                }}
                className="btn-back-link d-inline-flex align-items-center gap-1"
                style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#0f172a', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', padding: '6px 14px', borderRadius: '8px', transition: 'all 0.2s ease' }}
              >
                <i className="bi bi-arrow-left"></i> Back to Shop
              </button>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-dark" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : !product ? (
              <div className="text-center py-5">
                <h2 className="mb-3">Product not found</h2>
                <Link to="/" className="btn-lime text-decoration-none d-inline-flex align-items-center px-4 py-2">
                  <i className="bi bi-arrow-left me-2"></i> Back to Shop
                </Link>
              </div>
            ) : (
              <div className="row g-4 g-lg-5 align-items-start">
                {/* Left: Image and Action Controls */}
                <div className="col-9 col-sm-7 col-md-6 col-lg-5 mx-auto mx-lg-0">
                  <div className="detail-img-card" style={{ overflow: 'hidden', borderRadius: 'var(--r-md)', aspectRatio: '1 / 1', marginBottom: product.images && product.images.length > 1 ? '0.75rem' : '1.25rem', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
                    <img
                      src={getImageUrl(activeImage, product)}
                      alt={product.name}
                      className="img-fluid w-100 h-100"
                      style={{ objectFit: 'cover', transition: 'all 0.3s ease' }}
                      onError={(e) => { e.currentTarget.src = getProductPlaceholderSvg(product.name, product.type || product.category); }}
                    />
                  </div>

                  {product.images && product.images.length > 1 && (
                    <div className="detail-thumbnails d-flex gap-2 mb-3">
                      {product.images.map((img, idx) => {
                        const isCurrent = (activeImage === img) || (!selectedImage && idx === 0);
                        return (
                          <button
                            key={idx}
                            type="button"
                            className={`detail-thumb-btn ${isCurrent ? 'active' : ''}`}
                            onClick={() => setSelectedImage(img)}
                            aria-label={`View image ${idx + 1}`}
                            style={{
                              width: '60px',
                              height: '60px',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              border: isCurrent ? '2.5px solid #c8f53c' : '1.5px solid #e2e8f0',
                              padding: 0,
                              background: '#f8fafc',
                              cursor: 'pointer',
                              boxShadow: isCurrent ? '0 0 0 2px rgba(200,245,60,0.4)' : 'none',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <img
                              src={getImageUrl(img, product)}
                              alt={`Thumbnail ${idx + 1}`}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => { e.currentTarget.src = getProductPlaceholderSvg(product.name, product.type || product.category); }}
                            />
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {product.stock === 0 ? (
                    <div className="alert alert-danger mb-0" role="alert" style={{ borderRadius: '8px', fontWeight: 600, fontSize: '0.92rem' }}>
                      This item is currently sold out.
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-3 w-100">
                      {/* Quantity + enquiry actions */}
                      <div className="detail-actions d-flex align-items-center gap-2 gap-sm-3 w-100">
                        <div className="qty-control" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1.5px solid #e2e8f0', borderRadius: '8px', padding: '0.4rem 0.6rem', background: '#f8fafc', width: '105px', height: '50px', flexShrink: 0 }}>
                          <button
                            className="qty-btn"
                            onClick={decrementQty}
                            aria-label="Decrease quantity"
                            style={{ background: 'none', border: 0, width: '26px', height: '26px', display: 'grid', placeItems: 'center', color: '#1e293b', fontSize: '1.1rem', cursor: 'pointer' }}
                          >
                            <i className="bi bi-dash"></i>
                          </button>
                          <span className="qty-num" style={{ minWidth: '22px', textAlign: 'center', fontWeight: 800, fontSize: '1.1rem', color: '#0f172a', fontFamily: 'Space Grotesk, sans-serif' }}>
                            {quantity}
                          </span>
                          <button
                            className="qty-btn"
                            onClick={incrementQty}
                            aria-label="Increase quantity"
                            style={{ background: 'none', border: 0, width: '26px', height: '26px', display: 'grid', placeItems: 'center', color: '#1e293b', fontSize: '1.1rem', cursor: 'pointer' }}
                          >
                            <i className="bi bi-plus"></i>
                          </button>
                        </div>

                        {/* Add to enquiry */}
                        <button
                          className="btn-add-cart-secondary flex-grow-1"
                          onClick={handleAddToCart}
                          style={{ height: '50px', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 700, background: '#f1f5f9', color: '#0f172a', border: '1.5px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s ease', cursor: 'pointer' }}
                        >
                          <i className="bi bi-bag" style={{ fontSize: '1.1rem' }}></i>
                          <span>Add to enquiry</span>
                        </button>
                      </div>

                      {/* Direct WhatsApp enquiry CTA */}
                      <button
                        type="button"
                        onClick={handleDirectOrder}
                        className="btn-whatsapp-order w-100"
                        style={{ height: '52px', borderRadius: '8px', fontSize: '1.02rem', fontWeight: 800, background: '#25D366', color: '#FFFFFF', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 4px 16px rgba(37,211,102,0.32)', textDecoration: 'none', transition: 'all 0.2s ease', cursor: 'pointer' }}
                      >
                        <i className="bi bi-whatsapp" style={{ fontSize: '1.25rem' }}></i>
                        <span>Enquire on WhatsApp · ₹{product.price * quantity}</span>
                      </button>

                      {/* Enquire & Share Row */}
                      <div className="d-flex align-items-center gap-2 w-100">
                        <a
                          href={buildWhatsAppUrl(buildProductInquiryMessage(product))}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary-action flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                          style={{ height: '42px', borderRadius: '8px', fontSize: '0.86rem', fontWeight: 600, background: '#ffffff', color: '#334155', border: '1px solid #e2e8f0', textDecoration: 'none', transition: 'all 0.2s ease' }}
                        >
                          <i className="bi bi-chat-dots" style={{ color: '#25D366' }}></i>
                          <span>Ask a Question</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => {
                            const text = buildProductShareText(product);
                            shareToWhatsApp(text);
                          }}
                          className="btn-secondary-action flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                          style={{ height: '42px', borderRadius: '8px', fontSize: '0.86rem', fontWeight: 600, background: '#ffffff', color: '#334155', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s ease' }}
                        >
                          <i className="bi bi-share" style={{ color: '#0284c7' }}></i>
                          <span>Share Product</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Info */}
                <div className="col-12 col-lg-6 offset-lg-1">
                  <div className="detail-copy">
                    <span className="prod-kicker">
                      {product.type}{product.category ? ` / ${product.category}` : ''}
                    </span>
                    <h1 className="detail-title" style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.8rem' }}>
                      {product.name}
                    </h1>
                    <div className="d-flex align-items-baseline gap-3 mb-1">
                      <div className="detail-price" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.8rem', color: '#111', margin: 0 }}>
                        ₹{product.price}
                      </div>
                    </div>

                    <div className="detail-trust-row">
                      <span className="detail-trust-item"><i className="bi bi-shield-check"></i> Secure enquiry</span>
                      <span className="detail-trust-item"><i className="bi bi-truck"></i> Ships in 1–3 days</span>
                      <span className="detail-trust-item"><i className="bi bi-arrow-return-left"></i> Easy returns</span>
                    </div>

                    <hr className="my-4" style={{ opacity: 0.08, borderColor: '#000' }} />

                    <p className="detail-desc" style={{ fontSize: '0.95rem', color: '#555', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                      {product.description}
                    </p>

                    <ul className="detail-benefits">
                      {(product.points || []).map((pt, index) => (
                        <li key={index}>
                          <i className="bi bi-check2-circle"></i>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>

                    {includedItems.length > 0 && (
                      <div className="detail-kit-items mt-4 mb-4">
                        <h3 className="detail-kit-title" style={{ fontSize: '1rem', fontWeight: 700, color: '#111', marginBottom: '0.8rem' }}>
                          Included in this set:
                        </h3>
                        <div className="detail-kit-list d-flex flex-column gap-2">
                          {includedItems.map(item => (
                            <div key={item.id} className="detail-kit-item d-flex align-items-center gap-3 p-2" style={{ border: '1px solid rgba(0,0,0,0.06)', borderRadius: 'var(--r-xs)', background: '#fafafa' }}>
                              <img
                                src={getImageUrl(item.image, item)}
                                alt={item.name}
                                style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                                onError={(e) => { e.currentTarget.src = getProductPlaceholderSvg(item.name, item.type || item.category); }}
                              />
                              <div className="flex-grow-1">
                                <h4 style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0, color: '#222' }}>{item.name}</h4>
                                <span style={{ fontSize: '0.72rem', color: '#777' }}>{item.type}</span>
                              </div>
                              <div className="detail-kit-price" style={{ fontWeight: 600, fontSize: '0.85rem', color: '#111' }}>₹{item.price}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Mobile sticky buy bar */}
                    {product && product.stock > 0 && (
                      <div className="detail-sticky-bar">
                        <div className="detail-sticky-price">₹{product.price}</div>
                        <button
                          type="button"
                          onClick={handleDirectOrder}
                          className="detail-sticky-cta"
                        >
                          <i className="bi bi-whatsapp"></i>
                          <span>Enquire on WhatsApp</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <Modals />
    </>
  );
}
