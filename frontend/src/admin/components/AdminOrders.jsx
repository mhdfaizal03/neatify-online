import React from 'react';

export default function AdminOrders() {
  return (
    <>
      <section className="view" id="view-orders">
        <div className="page-head">
          <div>
            <h2>Enquiries & WhatsApp Orders</h2>
            <p>Live customer orders and enquiries submitted through the storefront</p>
          </div>
          <div className="head-actions">
            <select id="orderStatusFilter" className="filter-select" aria-label="Filter by order status">
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <button className="btn-secondary" id="refreshOrders">
              <i className="bi bi-arrow-clockwise"></i> Refresh
            </button>
          </div>
        </div>

        <div className="panel">
          <div className="panel-body">
            <div className="table-wrap animate-fade">
              <table className="data-table orders-data-table">
                <thead>
                  <tr>
                    <th>Ref ID</th>
                    <th>Customer & Contact</th>
                    <th>Enquired Items</th>
                    <th>Estimated Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody id="ordersTable">
                  
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
