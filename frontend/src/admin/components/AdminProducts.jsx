import React from 'react';

export default function AdminProducts() {
  return (
    <>
      <section className="view" id="view-products">
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
        </section>
    </>
  );
}
