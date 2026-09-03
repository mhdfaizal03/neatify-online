import React from 'react';

export default function AdminOrders() {
  return (
    <>
      <section className="view" id="view-orders">
          <div className="page-head">
            <div>
              <h2>Enquiries</h2>
              <p>Review and respond to WhatsApp product enquiries</p>
            </div>
          </div>
          <div className="panel">
            <div className="panel-body">
              <div className="table-wrap animate-fade">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Enquiry ID</th>
                      <th>Items</th>
                      <th>Estimated total</th>
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
