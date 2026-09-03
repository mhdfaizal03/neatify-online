import React from 'react';

export default function AdminDashboard() {
  return (
    <>
      <section className="view active" id="view-dashboard">
          <div className="page-head">
            <div>
              <h2>Dashboard</h2>
              <p>Performance overview</p>
            </div>
            <button className="btn-secondary" id="refreshStats"><i className="bi bi-arrow-clockwise"></i> Refresh</button>
          </div>
          <div className="stat-grid" id="statGrid">
            
          </div>
          <div className="panel-grid">
            <div className="panel">
              <div className="panel-head">
                <h3>Category Breakdown</h3>
              </div>
              <div className="panel-body" id="categoryChart"></div>
            </div>
            <div className="panel">
              <div className="panel-head">
                <h3>Recent Enquiries</h3>
              </div>
              <div className="panel-body" id="recentOrders"></div>
            </div>
          </div>
        </section>
    </>
  );
}
