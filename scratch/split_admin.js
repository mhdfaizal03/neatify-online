const fs = require('fs');

const content = fs.readFileSync('frontend/src/admin/pages/Admin.jsx', 'utf8');

function extractBetween(str, startStr, endStr) {
  const startIdx = str.indexOf(startStr);
  if (startIdx === -1) return null;
  const endIdx = str.indexOf(endStr, startIdx + startStr.length);
  if (endIdx === -1) return null;
  return str.substring(startIdx, endIdx + endStr.length);
}

const sidebar = extractBetween(content, '<aside className="sidebar"', '</aside>');
const header = extractBetween(content, '<header className="topbar">', '</header>');
const overview = extractBetween(content, '<!-- Dashboard Overview -->', '</div>\n          </section>\n\n          {/* Products Management */}');
const products = extractBetween(content, '{/* Products Management */}', '</section>\n\n          {/* Order Management */}');
const orders = extractBetween(content, '{/* Order Management */}', '</section>\n        </main>');

fs.writeFileSync('frontend/src/admin/components/Sidebar.jsx', `import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    ${sidebar ? sidebar.replace(/<li.*?<a href="#([^"]+)".*?>([^<]+)<.*?<\/li>/g, '<li><NavLink to="/admin/$1" className={({isActive}) => isActive ? "active" : ""}>$2</NavLink></li>') : '<aside className="sidebar"></aside>'}
  );
}
`);

fs.writeFileSync('frontend/src/admin/components/Topbar.jsx', `import React from 'react';

export default function Topbar() {
  return (
    ${header || '<header className="topbar"></header>'}
  );
}
`);

fs.writeFileSync('frontend/src/admin/pages/Dashboard.jsx', `import React from 'react';

export default function Dashboard() {
  return (
    <>
      ${overview || ''}
    </>
  );
}
`);

fs.writeFileSync('frontend/src/admin/pages/ProductsManager.jsx', `import React from 'react';
import { useProducts } from '../../hooks/useProducts';

export default function ProductsManager() {
  const { data: response, isLoading } = useProducts();
  const products = response?.data || [];

  return (
    <section id="products" className="view-section active">
      <div className="section-header">
        <h2>Product Management</h2>
        <button className="btn btn-primary" id="addProductBtn">
          <i className="bi bi-plus-lg"></i> Add New Product
        </button>
      </div>

      <div className="card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0" id="productsTable">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan="6" className="text-center py-4">Loading products...</td></tr>
                ) : products.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-4">No products found.</td></tr>
                ) : (
                  products.map(product => (
                    <tr key={product._id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <img src={product.image || "/assets/placeholder.png"} alt={product.name} className="rounded" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                          <div className="fw-semibold">{product.name}</div>
                        </div>
                      </td>
                      <td>{product.category}</td>
                      <td>₹{product.price}</td>
                      <td>{product.stock || 'In Stock'}</td>
                      <td>
                        <span className={\`badge \${product.active ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}\`}>
                          {product.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group">
                          <button className="btn btn-sm btn-outline-secondary" title="Edit"><i className="bi bi-pencil"></i></button>
                          <button className="btn btn-sm btn-outline-danger" title="Delete"><i className="bi bi-trash"></i></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
`);

fs.writeFileSync('frontend/src/admin/pages/OrdersManager.jsx', `import React from 'react';

export default function OrdersManager() {
  return (
    <>
      ${orders || ''}
    </>
  );
}
`);

console.log("Admin splitting complete!");
