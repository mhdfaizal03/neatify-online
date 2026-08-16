import React from 'react';

export default function AdminOrders() {
  return (
    <>
      <section className="view" id="view-orders">
          <div className="page-head">
            <div>
              <h2>Orders</h2>
              <p>Manage customer orders</p>
            </div>
          </div>
          <div className="panel">
            <div className="panel-body">
              <div className="table-wrap animate-fade">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
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
