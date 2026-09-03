import React from 'react';

export default function Modals() {
  return (
    <>
      <div className="toast-stack" id="toastContainer"></div>

  
  <div className="offcanvas offcanvas-end cart-drawer" tabIndex="-1" id="cartDrawer" aria-labelledby="cartTitle">
    <div className="offcanvas-header">
      <div>
        <p className="cart-eyebrow">YOUR ENQUIRY</p>
        <h2 id="cartTitle">My Enquiry</h2>
      </div>
      <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div className="offcanvas-body d-flex flex-column">
      <div id="cartItems" className="cart-items flex-grow-1"></div>
      <div id="cartEmpty" className="cart-empty">
        <i className="bi bi-bag-x"></i>
        <h4>Your enquiry is empty</h4>
        <p>Add products to ask about availability and details.</p>
        <button className="btn-dark" data-bs-dismiss="offcanvas">Browse products</button>
      </div>
      <div className="cart-foot d-none" id="cartFooter">
        <div className="ship-bar-wrap" id="shipProgress">
          <p id="shipMessage"></p>
          <div className="ship-track"><span id="shipFill"></span></div>
        </div>
        <div className="cart-row"><span>Estimated subtotal</span><span id="cartSubtotal">₹0</span></div>
        <div className="cart-row"><span>Shipping</span><span id="cartShipping">₹0</span></div>
        <div className="cart-total"><span>Estimated total</span><strong id="cartTotal">₹0</strong></div>
        <button className="btn-lime w-100 d-flex align-items-center justify-content-center gap-2" id="checkoutBtn">
          <i className="bi bi-whatsapp fs-5"></i>
          <span>Send Enquiry on WhatsApp</span>
        </button>
      </div>
    </div>
  </div>

  
  <div className="modal fade" id="productModal" tabIndex="-1" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content prod-modal">
        <button type="button" className="modal-x" data-bs-dismiss="modal" aria-label="Close"><i className="bi bi-x-lg"></i></button>
        <div className="row g-0" id="productModalContent"></div>
      </div>
    </div>
  </div>

  
  <div className="modal fade" id="notifyModal" tabIndex="-1" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered modal-sm">
      <div className="modal-content info-modal">
        <div className="info-icon"><i className="bi bi-bell"></i></div>
        <h3>Interior is coming.</h3>
        <p>Leave your email and we'll add you to the launch list.</p>
        <form id="notifyForm">
          <input type="email" className="form-control" placeholder="you@example.com" required aria-label="Email" />
          <button className="btn-lime w-100 mt-3" type="submit" id="notifySubmit">Notify me</button>
        </form>
      </div>
    </div>
  </div>

  
  <div className="modal fade" id="authModal" tabIndex="-1" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content auth-modal p-0">
        <button type="button" className="modal-x" data-bs-dismiss="modal" aria-label="Close"><i className="bi bi-x-lg"></i></button>
        <div className="row g-0">

          {/* ── Visual pane ── */}
          <div className="col-md-5 d-none d-md-flex auth-visual-panel">
            <div className="auth-visual-content">
              <span className="brand-text">Neatify<span className="brand-accent">.</span></span>
              <p className="auth-visual-tagline">Engineered for ultimate automotive protection.</p>
              <ul className="auth-visual-perks">
                <li><i className="bi bi-check-circle-fill"></i> Enquiry history</li>
                <li><i className="bi bi-check-circle-fill"></i> Faster repeat enquiries</li>
                <li><i className="bi bi-check-circle-fill"></i> Exclusive member offers</li>
              </ul>
              <div className="auth-visual-glow"></div>
            </div>
          </div>

          {/* ── Form pane ── */}
          <div className="col-md-7 auth-form-panel">
            <p id="authNotice" className="auth-notice d-none"><i className="bi bi-shield-lock"></i> Sign in to save your enquiry.</p>

            {/* Tabs — Login / Register */}
            <div className="auth-tabs" role="tablist">
              <button className="auth-tab active" id="authTabLogin" type="button">Sign in</button>
              <button className="auth-tab" id="authTabRegister" type="button">Register</button>
            </div>

            <p className="auth-error d-none" id="authError"></p>

            {/* ── Sign in form ── */}
            <form id="loginForm" noValidate>
              <div className="af-group">
                <label className="af-label" htmlFor="liEmail">Email address</label>
                <input className="af-input" type="email" id="liEmail" placeholder="you@example.com" autoComplete="email" required />
              </div>
              <div className="af-group">
                <div className="af-label-row">
                  <label className="af-label" htmlFor="liPassword">Password</label>
                  <button type="button" className="af-forgot-link" id="forgotLink">Forgot password?</button>
                </div>
                <div className="pw-wrap">
                  <input className="af-input" type="password" id="liPassword" placeholder="••••••••" autoComplete="current-password" required />
                  <button type="button" className="pw-eye" data-eye="liPassword" aria-label="Toggle password"><i className="bi bi-eye"></i></button>
                </div>
              </div>
              <button className="btn-lime w-100 mt-1" type="submit" id="loginBtn">Sign in <i className="bi bi-box-arrow-in-right"></i></button>
            </form>

            {/* ── Register form ── */}
            <form id="registerForm" className="d-none" noValidate>
              <div className="af-group">
                <label className="af-label" htmlFor="rgName">Full name</label>
                <input className="af-input" type="text" id="rgName" placeholder="Your name" autoComplete="name" required />
              </div>
              <div className="af-group">
                <label className="af-label" htmlFor="rgEmail">Email address</label>
                <input className="af-input" type="email" id="rgEmail" placeholder="you@example.com" autoComplete="email" required />
              </div>
              <div className="af-group">
                <label className="af-label" htmlFor="rgPassword">Password</label>
                <div className="pw-wrap">
                  <input className="af-input" type="password" id="rgPassword" placeholder="Min. 6 characters" autoComplete="new-password" required />
                  <button type="button" className="pw-eye" data-eye="rgPassword" aria-label="Toggle password"><i className="bi bi-eye"></i></button>
                </div>
              </div>
              <button className="btn-lime w-100 mt-1" type="submit" id="registerBtn">Create account <i className="bi bi-person-plus"></i></button>
              <p className="auth-fine">One account for enquiry history and faster repeat enquiries.</p>
            </form>

            {/* ── Forgot password form ── */}
            <form id="forgotForm" className="d-none" noValidate>
              <p className="af-forgot-intro">Enter your email and we'll send a reset link.</p>
              <div className="af-group">
                <label className="af-label" htmlFor="forgotEmail">Email address</label>
                <input className="af-input" type="email" id="forgotEmail" placeholder="you@example.com" autoComplete="email" required />
              </div>
              <button className="btn-lime w-100 mt-1" type="submit" id="forgotBtn">Send reset link <i className="bi bi-envelope"></i></button>
              <button type="button" className="af-back-link" id="forgotBackBtn"><i className="bi bi-arrow-left"></i> Back to sign in</button>
            </form>

          </div>
        </div>
      </div>
    </div>
  </div>

  
  <div className="modal fade" id="accountModal" tabIndex="-1" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content account-modal">
        <button type="button" className="modal-x" data-bs-dismiss="modal" aria-label="Close"><i className="bi bi-x-lg"></i></button>
        <div className="row g-0">
          <div className="col-md-4 acc-side">
            <div className="acc-avatar-glow">
              <div className="acc-avatar" id="accAvatar">N</div>
            </div>
            <h3 id="accName">—</h3>
            <p id="accEmail" className="acc-email">—</p>
            <p className="acc-since" id="accSince"></p>
            <div className="acc-tabs" role="tablist">
              <button className="acc-tab active" data-acc="orders" type="button"><i className="bi bi-chat-square-text"></i> Enquiries</button>
              <button className="acc-tab" data-acc="profile" type="button"><i className="bi bi-person"></i> Profile</button>
              <button className="acc-tab" data-acc="security" type="button"><i className="bi bi-key"></i> Security</button>
            </div>
            <button className="acc-logout" id="logoutBtn" type="button"><i className="bi bi-box-arrow-right"></i> Sign out</button>
          </div>
          <div className="col-md-8 acc-main">
            <div className="acc-pane active" id="accPaneOrders">
              <h4>Your enquiries</h4>
              <div id="accOrders" className="acc-orders"></div>
            </div>
            <div className="acc-pane" id="accPaneProfile">
              <h4>Profile details</h4>
              <form id="profileForm" noValidate>
                <label>Full name<input type="text" id="pfName" autoComplete="name" /></label>
                <label>Email <span className="opt">(fixed)</span><input type="email" id="pfEmail" disabled /></label>
                <label>Phone<input type="tel" id="pfPhone" placeholder="+91 98765 43210" autoComplete="tel" /></label>
                <label>Default address<textarea id="pfAddress" rows="3" placeholder="House, street, city, PIN" autoComplete="street-address"></textarea></label>
                <button className="btn-lime" type="submit" id="profileSaveBtn">Save changes <i className="bi bi-check2"></i></button>
              </form>
            </div>
            <div className="acc-pane" id="accPaneSecurity">
              <h4>Change password</h4>
              <form id="passwordForm" noValidate>
                <label>Current password<input type="password" id="pwCurrent" autoComplete="current-password" /></label>
                <label>New password<input type="password" id="pwNext" placeholder="Min. 6 characters" autoComplete="new-password" /></label>
                <button className="btn-lime" type="submit" id="passwordSaveBtn">Update password <i className="bi bi-key"></i></button>
                <p className="auth-fine">You'll stay signed in on this device after updating.</p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  
  <div className="modal fade" id="checkoutModal" tabIndex="-1" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered modal-xl">
      <div className="modal-content checkout-modal">
        <button type="button" className="modal-x" data-bs-dismiss="modal" aria-label="Close"><i className="bi bi-x-lg"></i></button>
        <div className="row g-0">
          <div className="col-lg-7 co-form-side" style={{ maxHeight: '85vh', overflowY: 'auto' }}>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-success text-white px-2 py-1" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                <i className="bi bi-whatsapp me-1"></i> WhatsApp Direct Enquiry
              </span>
              <p className="cart-eyebrow mb-0">NEATIFY — ENQUIRY DETAILS</p>
            </div>
            <h3>Enquiry details</h3>
            <p className="co-sub mb-3">Add your contact details so the team can respond with availability, final pricing, and delivery information.</p>
            
            <form id="checkoutForm" noValidate>
              {/* Customer Contact */}
              <div className="field-row">
                <label>Customer Name *<input type="text" id="coName" placeholder="Full Name" required autoComplete="name" /><small className="ferr" id="coNameError"></small></label>
                <label>Phone / WhatsApp Number *<input type="tel" id="coPhone" placeholder="+91 98765 43210" required autoComplete="tel" /><small className="ferr" id="coPhoneError"></small></label>
              </div>

              <div className="field-row">
                <label>Alternative Number <span className="opt">(Optional)</span><input type="tel" id="coAltPhone" placeholder="Alternate phone / landline" autoComplete="tel" /></label>
                <label>Email Address <span className="opt">(Optional)</span><input type="email" id="coEmail" placeholder="you@example.com" autoComplete="email" /></label>
              </div>

              <label>What can we help with?
                <select id="coEnquiryType" defaultValue="availability">
                  <option value="availability">Check availability</option>
                  <option value="quote">Request a quote</option>
                  <option value="product-details">Ask about product details</option>
                  <option value="bulk">Bulk or business enquiry</option>
                </select>
              </label>

              <div className="divider my-3" style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}></div>
              <h5 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#111', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                <i className="bi bi-geo-alt-fill text-success me-1"></i> Full Delivery Address
              </h5>

              <div className="field-row">
                <label>House / Building Name *<input type="text" id="coHouse" placeholder="House No. / Villa / Apartment Name" required autoComplete="address-line1" /><small className="ferr" id="coHouseError"></small></label>
                <label>Street / Road *<input type="text" id="coStreet" placeholder="Street Name / Main Road / Colony" required autoComplete="address-line2" /><small className="ferr" id="coStreetError"></small></label>
              </div>

              <div className="field-row">
                <label>Area / Locality *<input type="text" id="coLocality" placeholder="Area / Locality / Sector" required /><small className="ferr" id="coLocalityError"></small></label>
                <label>City / Town *<input type="text" id="coCity" placeholder="City or Town" required autoComplete="address-level2" /><small className="ferr" id="coCityError"></small></label>
              </div>

              <div className="field-row">
                <label>District *<input type="text" id="coDistrict" placeholder="District" required /><small className="ferr" id="coDistrictError"></small></label>
                <label>State *<input type="text" id="coState" placeholder="State (e.g. Kerala, Karnataka)" required autoComplete="address-level1" /><small className="ferr" id="coStateError"></small></label>
              </div>

              <div className="field-row">
                <label>PIN Code *<input type="text" id="coPin" placeholder="6-digit PIN" maxLength={6} required autoComplete="postal-code" /><small className="ferr" id="coPinError"></small></label>
                <label>Landmark <span className="opt">(Optional)</span><input type="text" id="coLandmark" placeholder="Nearby shop, school, or metro" /></label>
              </div>

              <label className="mt-2">Delivery Instructions <span className="opt">(Optional)</span>
                <textarea id="coInstructions" rows="2" placeholder="e.g. Call before delivery, leave with security..."></textarea>
              </label>
            </form>
          </div>
          
          <div className="col-lg-5 co-summary-side" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div className="co-summary-receipt">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h4 className="mb-0">Enquiry summary</h4>
                <span className="badge bg-dark text-white px-2 py-1" style={{ fontSize: '0.7rem' }}>WHATSAPP READY</span>
              </div>
              <div id="checkoutItems" className="co-items" style={{ maxHeight: '220px', overflowY: 'auto' }}></div>
              <div className="co-lines my-3">
                <div><span>Subtotal</span><span id="coSubtotal">₹0</span></div>
                <div><span>Shipping</span><span id="coShipping">₹0</span></div>
                <div className="co-grand"><span>Estimated total</span><strong id="coTotal" className="text-success">₹0</strong></div>
              </div>
              
              <button className="btn-lime w-100 d-flex align-items-center justify-content-center gap-2" id="placeOrderBtn" form="checkoutForm" type="submit" style={{ height: '52px', fontSize: '1rem', fontWeight: 800 }}>
                <i className="bi bi-whatsapp fs-5"></i>
                <span>Open WhatsApp →</span>
              </button>
              <p className="co-note mt-2 text-center" style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)' }}>
                <i className="bi bi-shield-check text-success me-1"></i> Your enquiry details are saved securely. Final availability and pricing are confirmed by the business.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div className="modal fade" id="orderSuccessModal" tabIndex="-1" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered modal-sm">
      <div className="modal-content info-modal success-modal-content">
        <div className="success-icon-wrap" style={{ background: 'rgba(37,211,102,0.12)' }}>
          <i className="bi bi-whatsapp text-success" style={{ fontSize: '2.5rem' }}></i>
        </div>
        <h3>Enquiry ready</h3>
        <p>Your product enquiry is ready in WhatsApp. Review it and send it to the business.</p>
        <div className="order-chip-premium" id="orderIdChip">ENQ-000000</div>
        <div className="d-flex flex-column gap-2 mt-4 w-100">
          <a href="https://wa.me/918113001959" target="_blank" rel="noopener noreferrer" className="btn-lime w-100 text-decoration-none d-flex align-items-center justify-content-center gap-2" id="reopenWaBtn">
            <i className="bi bi-whatsapp"></i> Chat with Support
          </a>
          <button className="btn-dark w-100" data-bs-dismiss="modal">Continue browsing</button>
        </div>
      </div>
    </div>
  </div>
    </>
  );
}
