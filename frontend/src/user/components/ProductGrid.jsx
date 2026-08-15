import React from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useCartStore } from '../../store/useCartStore';

export default function ProductGrid() {
  const { data: response, isLoading, isError } = useProducts();
  const addItem = useCartStore((state) => state.addItem);
  const products = response?.data || [];

  return (
    <section className="shop-section" id="shop">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-badge">Our Products</span>
          <h2 className="section-title">Premium Vehicle Care Lineup</h2>
          <p className="section-desc">Formulated for perfection, trusted by professionals.</p>
        </div>
        
        {isLoading ? (
          <div className="text-center py-5">Loading products...</div>
        ) : isError ? (
          <div className="text-center py-5 text-danger">Failed to load products.</div>
        ) : (
          <div className="row g-4" id="productGrid">
            {products.map(product => (
              <div className="col-lg-3 col-md-6" key={product._id}>
                <div className="product-card">
                  {product.badge && <span className="product-badge">{product.badge}</span>}
                  <div className="product-img-wrapper">
                    <img src={product.image || "/assets/placeholder.png"} alt={product.name} className="product-img" />
                    <div className="product-actions">
                      <button className="action-btn" aria-label="Quick view"><i className="bi bi-eye"></i></button>
                    </div>
                  </div>
                  <div className="product-info">
                    <div className="product-category">{product.category}</div>
                    <h3 className="product-title">{product.name}</h3>
                    <div className="product-rating">
                      <i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-half"></i>
                      <span className="rating-count">(4.8)</span>
                    </div>
                    <div className="product-bottom">
                      <div className="product-price">₹{product.price}</div>
                      <button className="add-to-cart-btn" onClick={() => addItem(product)}>Add <i className="bi bi-plus-lg"></i></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
