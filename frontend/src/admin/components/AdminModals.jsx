import React from 'react';

export default function AdminModals() {
  return (
    <>
      <div className="modal-backdrop hidden" id="productModal" role="dialog" aria-labelledby="productModalTitle">
        <div className="modal-card">
          <div className="modal-head">
            <h3 id="productModalTitle">Add Product</h3>
            <button className="icon-btn" id="closeProductModal" aria-label="Close modal"><i className="bi bi-x-lg"></i></button>
          </div>
          <form id="productForm">
            <div className="modal-body">
              <input type="hidden" id="productId" />
              <div className="form-grid">
                <label className="full">Product Name
                  <input type="text" id="productName" required />
                </label>
                <label>Category
                  <select id="productCategory">
                    <option value="wash">Wash</option>
                    <option value="tools">Tools</option>
                    <option value="kit">Kit</option>
                    <option value="finish">Finish</option>
                  </select>
                </label>
                <label>Short Type (Label)
                  <input type="text" id="productType" placeholder="e.g. SHAMPOO" />
                </label>
                <label>Price (₹)
                  <input type="number" id="productPrice" min="0" required />
                </label>
                <label>Stock Quantity
                  <input type="number" id="productStock" min="0" required />
                </label>
                <label>Display Order
                  <input type="number" id="productFeatured" min="1" defaultValue="1" />
                </label>
                <label>Display Badge
                  <input type="text" id="productBadge" placeholder="e.g. NEW" />
                </label>
                <label className="full">Main Image
                  <div className="image-picker">
                    <input type="text" id="productImage" placeholder="Upload or enter URL" required />
                    <button type="button" className="btn-secondary" id="pickImageBtn">Browse</button>
                  </div>
                </label>
                <label className="full">Long Description
                  <textarea id="productDescription" rows="3"></textarea>
                </label>
                <label className="full">Bullet Points (One per line)
                  <textarea id="productPoints" rows="4" placeholder="Deep cleaning formula&#10;pH Neutral"></textarea>
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" id="productActive" defaultChecked />
                  <span>Show on Storefront</span>
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" id="productIsKit" />
                  <span>Mark as Featured Kit Offer</span>
                </label>
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" id="cancelProductModal">Cancel</button>
              <button type="submit" className="btn-primary">Save Product</button>
            </div>
          </form>
        </div>
      </div>
      <div className="modal-backdrop hidden" id="kitModal" role="dialog" aria-labelledby="kitModalTitle">
        <div className="modal-card">
          <div className="modal-head">
            <h3 id="kitModalTitle">Add Kit</h3>
            <button className="icon-btn" id="closeKitModal" aria-label="Close modal"><i className="bi bi-x-lg"></i></button>
          </div>
          <form id="kitForm">
            <div className="modal-body">
              <input type="hidden" id="kitId" />
              <div className="form-grid">
                <label className="full">Kit Name
                  <input type="text" id="kitName" required />
                </label>
                <label>Price (₹)
                  <input type="number" id="kitPrice" min="0" required />
                </label>
                <label>Stock Quantity
                  <input type="number" id="kitStock" min="0" required />
                </label>
                <label>Display Badge
                  <input type="text" id="kitBadge" placeholder="e.g. THE WEEKEND KIT" />
                </label>
                <label>Display Order
                  <input type="number" id="kitFeatured" min="1" defaultValue="1" />
                </label>
                <label className="full">Main Kit Image
                  <div className="image-picker">
                    <input type="text" id="kitImage" placeholder="Upload or enter main image URL" required />
                    <button type="button" className="btn-secondary" id="pickKitImageBtn">Browse</button>
                  </div>
                </label>
                <label className="full">Offer / Secondary Image <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 400 }}>(Optional bonus gift / offer image)</span>
                  <div className="image-picker">
                    <input type="text" id="kitSecondaryImage" placeholder="Upload or enter secondary/offer image URL" />
                    <button type="button" className="btn-secondary" id="pickKitSecondaryImageBtn">Browse</button>
                  </div>
                </label>
                <label className="full">Short Description
                  <textarea id="kitDescription" rows="2"></textarea>
                </label>
                
                <label className="full">Kit Highlights (Press Enter or comma to add)
                  <div className="pill-input-container">
                    <div id="kitPointsWrap" className="pill-wrap"></div>
                    <input type="text" id="kitPointInput" placeholder="Add a highlight point..." />
                    <input type="hidden" id="kitPointsHidden" />
                  </div>
                </label>

                <label className="full">Included Products
                  <div className="checklist-container" id="kitProductsChecklist" style={{maxHeight: '150px', overflowY: 'auto', background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: 'var(--radius-sm)'}}>
                    {/* Checkboxes injected by JS */}
                  </div>
                </label>

                <label className="checkbox-label">
                  <input type="checkbox" id="kitActive" defaultChecked />
                  <span>Show on Storefront</span>
                </label>
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" id="cancelKitModal">Cancel</button>
              <button type="submit" className="btn-primary">Save Kit</button>
            </div>
          </form>
        </div>
      </div>

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
        <h3 id="orderModalTitle">Enquiry Details</h3>
        <button className="icon-btn" id="closeOrderModal" aria-label="Close modal"><i className="bi bi-x-lg"></i></button>
      </div>
      <form id="orderForm">
        <div className="modal-body">
          <input type="hidden" id="orderId" />
          <div className="form-grid">
            <label className="full">Enquiry Info
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
