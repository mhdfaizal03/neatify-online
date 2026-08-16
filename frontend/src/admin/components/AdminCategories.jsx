import React from 'react';

export default function AdminCategories() {
  return (
    <>
      <section className="view" id="view-categories">
        <div className="page-head">
          <div>
            <h2>Categories</h2>
            <p>Manage product category filters</p>
          </div>
        </div>

        <div className="panel">
          <div className="categories-grid">
            {/* Left side: Add form */}
            <div className="categories-form-pane">
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '20px', color: 'var(--text-main)' }}>Add Category</h3>
              <form id="categoryForm" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Category Name
                  <input type="text" id="categoryName" placeholder="e.g. Interior" required style={{ width: '100%' }} />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Category ID (Slug)
                  <input type="text" id="categoryId" placeholder="e.g. interior" required style={{ width: '100%' }} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '400', marginTop: '4px' }}>
                    Lowercase letters, numbers, hyphens, and underscores only.
                  </span>
                </label>
                <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: '8px' }}>
                  <i className="bi bi-plus-lg"></i> Create Category
                </button>
              </form>
            </div>

            {/* Right side: List */}
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '20px', color: 'var(--text-main)' }}>Active Categories</h3>
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Slug ID</th>
                      <th>Category Name</th>
                      <th style={{ width: '80px', textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody id="categoriesTable">
                    {/* Dynamic Categories row list injected here */}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
