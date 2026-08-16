import React from 'react';

export default function AdminProducts() {
  return (
    <>
      <section className="view" id="view-products">
        <div className="split-list-pane">
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
                
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Details Panel */}
        <div className="modal-backdrop hidden" id="productModal" role="dialog" aria-labelledby="productModalTitle">
          <div className="modal-card">
            <div className="modal-head">
              <h3 id="productModalTitle">Add Product</h3>
              <button className="icon-btn" id="closeProductModal" aria-label="Close modal"><i className="bi bi-x-lg"></i></button>
            </div>
            <form id="productForm">
              <div className="modal-body">
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
                    <input type="checkbox" id="productActive" />
                    <span>Show on Storefront</span>
                  </label>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" id="cancelProductModal">Cancel</button>
                <button type="submit" className="btn-primary">Save Product</button>
              </div>
            </form>
          </div>
        </div>

        {/* Empty State placeholder for desktop */}
        <div className="split-details-empty">
          <i className="bi bi-box-seam"></i>
          <h3>No Product Selected</h3>
          <p>Click edit on any product to update its details, or click "Add Product" to create a new one.</p>
        </div>
      </section>
    </>
  );
}
