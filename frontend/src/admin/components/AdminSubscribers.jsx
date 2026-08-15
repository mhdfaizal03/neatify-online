import React from 'react';

export default function AdminSubscribers() {
  return (
    <>
      <section className="view" id="view-subscribers">
          <div className="page-head">
            <div>
              <h2>Subscribers</h2>
              <p>Marketing signups</p>
            </div>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Email Address</th>
                  <th>Type</th>
                  <th>Signup Date</th>
                </tr>
              </thead>
              <tbody id="subscribersTable">
                
              </tbody>
            </table>
          </div>
        </section>
    </>
  );
}
