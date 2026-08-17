import React from 'react';

export default function AdminKits() {
  return (
    <>
      <section className="view" id="view-kits">
        <div className="page-head">
          <div>
            <h2>Kit Offerings</h2>
            <p>Manage product bundles and weekend kits</p>
          </div>
          <button className="btn-primary" id="addKitBtn"><i className="bi bi-plus-lg"></i> Add New Kit</button>
        </div>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Badge</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="kitsTbody">
              {/* Kits rendered by JS */}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
