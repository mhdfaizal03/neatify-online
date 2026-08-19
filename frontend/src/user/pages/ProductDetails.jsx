import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Modals from '../components/Modals';
import { useStorefrontLogic } from '../hooks/useStorefrontLogic';

export default function ProductDetails() {
  useStorefrontLogic();
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

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
      } catch (err) {
        console.error(err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || !window.addToCart) return;
    
    // Add to cart matching selected quantity
    for (let i = 0; i < quantity - 1; i++) {
      window.addToCart(product.id);
    }
    // Show drawer on the last addition
    window.addToCart(product.id, true);
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
      <main id="productPage" style={{ paddingTop: 'var(--header-height)', minHeight: '80vh' }}>
        <section className="sec product-detail-sec">
          <div className="container">
            {/* Breadcrumbs */}
            <nav aria-label="breadcrumb" className="mb-5">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/" className="text-decoration-none">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <a href="/#shop" className="text-decoration-none">Shop</a>
                </li>
                <li className="breadcrumb-item active" id="breadcrumbName" aria-current="page" style={{ color: '#6e7872' }}>
                  {loading ? 'Loading...' : (product ? product.name : 'Product not found')}
                </li>
              </ol>
            </nav>

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
              <div className="row g-5 align-items-center">
                {/* Left: Image */}
                <div className="col-lg-6">
                  <div className="detail-img-card" style={{ overflow: 'hidden', borderRadius: 'var(--r-md)', aspectRatio: '1 / 1' }}>
                    <img 
                      src={product.image.startsWith('/') ? product.image : `/${product.image}`} 
                      alt={product.name} 
                      className="img-fluid w-100 h-100" 
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </div>
                
                {/* Right: Info */}
                <div className="col-lg-6">
                  <div className="detail-copy">
                    <span className="prod-kicker">
                      {product.type} / Exterior
                    </span>
                    <h1 className="detail-title" style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.8rem' }}>
                      {product.name}
                    </h1>
                    <div className="detail-price" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.8rem', color: '#111', marginBottom: '1.5rem' }}>
                      ₹{product.price}
                    </div>
                    
                    <hr className="my-4" style={{ opacity: 0.08, borderColor: '#000' }} />
                    
                    <p className="detail-desc" style={{ fontSize: '0.95rem', color: '#555', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                      {product.description}
                    </p>
                    
                    <ul className="detail-pts my-4" style={{ listStyle: 'none', paddingLeft: 0 }}>
                      {(product.points || []).map((pt, index) => (
                        <li key={index} className="d-flex align-items-center mb-2" style={{ fontSize: '0.9rem', color: '#444' }}>
                          <i className="bi bi-check2 text-success me-2 fs-5"></i>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <hr className="my-4" style={{ opacity: 0.08, borderColor: '#000' }} />
                    
                    {product.stock === 0 ? (
                      <div className="alert alert-danger" role="alert">
                        This item is currently sold out.
                      </div>
                    ) : (
                      <div className="detail-actions d-flex align-items-center gap-3">
                        <div className="qty-control" style={{ display: 'flex', alignItems: 'center', border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: 'var(--r-xs)', padding: '0.2rem' }}>
                          <button 
                            className="qty-btn" 
                            onClick={decrementQty} 
                            aria-label="Decrease quantity"
                            style={{ background: 'none', border: 0, width: '32px', height: '32px', display: 'grid', placeItems: 'center', color: '#555' }}
                          >
                            <i className="bi bi-dash"></i>
                          </button>
                          <span className="qty-num" style={{ minWidth: '24px', textAlign: 'center', fontWeight: 600, fontSize: '0.95rem' }}>
                            {quantity}
                          </span>
                          <button 
                            className="qty-btn" 
                            onClick={incrementQty} 
                            aria-label="Increase quantity"
                            style={{ background: 'none', border: 0, width: '32px', height: '32px', display: 'grid', placeItems: 'center', color: '#555' }}
                          >
                            <i className="bi bi-plus"></i>
                          </button>
                        </div>
                        <button className="btn-lime flex-grow-1 py-3" onClick={handleAddToCart}>
                          Add to cart <i className="bi bi-bag ms-1"></i>
                        </button>
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <Link to="/" className="btn-back d-inline-flex align-items-center text-decoration-none" style={{ color: '#6e7872', fontWeight: 600, fontSize: '0.9rem' }}>
                        <i className="bi bi-arrow-left me-2"></i> Back to Shop
                      </Link>
                    </div>
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
