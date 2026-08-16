import React from 'react';

export default function AdminModals() {
  return (
    <>


  
  <div className="modal-backdrop hidden" id="imagePickerModal" role="dialog">
    <div className="modal-card wide">
      <div className="modal-head">
        <h3>Select Asset</h3>
        <button className="icon-btn" id="closeImagePicker" aria-label="Close picker"><i className="bi bi-x-lg"></i></button>
      </div>
      <div className="media-grid compact" id="pickerGrid">
        
      </div>
    </div>
  </div>

  
  <div className="modal-backdrop hidden" id="orderModal" role="dialog" aria-labelledby="orderModalTitle">
    <div className="modal-card">
      <div className="modal-head">
        <h3 id="orderModalTitle">Order Details</h3>
        <button className="icon-btn" id="closeOrderModal" aria-label="Close modal"><i className="bi bi-x-lg"></i></button>
      </div>
      <form id="orderForm">
        <div className="modal-body">
          <input type="hidden" id="orderId" />
          <div className="form-grid">
            <label className="full">Order Info
              <div id="orderInfoDisplay" style={{ padding: '10px', background: 'var(--bg-alt)', borderRadius: '6px', fontSize: '0.9em' }}>
                
              </div>
            </label>
            <label>Status
              <select id="orderStatus">
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </label>
          </div>
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-secondary" id="cancelOrderModal">Cancel</button>
          <button type="submit" className="btn-primary">Update Status</button>
        </div>
      </form>
    </div>
  </div>

  
  <div className="snackbar hidden" id="snackbar" aria-live="polite"></div>
    </>
  );
}
