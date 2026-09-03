import React from 'react';

export default function AdminKits() {
  return (
    <>
      <section className="view" id="view-kits">
        <div className="page-head">
          <div>
            <h2>Kit Offerings</h2>
            <p>Manage product bundles, special offers & weekend kits</p>
          </div>
          <button className="btn-primary" id="addKitBtn">
            <i className="bi bi-plus-lg"></i> Add New Kit
          </button>
        </div>

        <div className="panel">
          <div className="panel-body">
            <div className="toolbar">
              <select id="kitFilter" aria-label="Filter Kit Status">
                <option value="all">All kit offerings</option>
                <option value="active">Active kits only</option>
                <option value="inactive">Inactive only</option>
              </select>
            </div>

            <div className="table-wrap animate-fade">
              <table className="data-table kits-data-table">
                <colgroup>
                  <col style={{ width: '28%' }} />
                  <col style={{ width: '34%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '8%' }} />
                  <col style={{ width: '8%' }} />
                </colgroup>
                <thead>
                  <tr>
                    <th>Kit Bundle</th>
                    <th>Highlights / Inclusions</th>
                    <th style={{ textAlign: 'right' }}>Price</th>
                    <th style={{ textAlign: 'center' }}>Badge</th>
                    <th style={{ textAlign: 'center' }}>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody id="kitsTbody">
                  {/* Dynamic Kit rows populated by useAdminLogic */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
