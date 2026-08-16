import React from 'react';

export default function AdminCategories() {
  return (
    <>
      <section className="view" id="view-categories">
        <div className="split-layout">
          {/* Left Pane: Add Category Form */}
          <div className="split-details-pane" style={{ position: 'static' }}>
            <div className="page-head" style={{ marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <h3>Add Category</h3>
            </div>
            <form id="categoryForm" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontWeight: '500' }}>
                Category Name
                <input type="text" id="categoryName" placeholder="e.g. Interior" required style={{ width: '100%' }} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontWeight: '500' }}>
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

          {/* Right Pane: Category List */}
          <div className="split-list-pane">
            <div className="page-head" style={{ marginBottom: '20px' }}>
              <div>
                <h2>Categories</h2>
                <p>Manage product category filters</p>
              </div>
            </div>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Slug ID</th>
                    <th>Category Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody id="categoriesTable">
                  {/* Dynamic Categories row list injected here */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
