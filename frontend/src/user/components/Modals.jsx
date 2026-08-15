import React from 'react';

export default function Modals() {
  return (
    <>
      <div className="toast-stack" id="toastContainer"></div>

  
  <div className="offcanvas offcanvas-end cart-drawer" tabIndex="-1" id="cartDrawer" aria-labelledby="cartTitle">
    <div className="offcanvas-header">
      <div>
        <p className="cart-eyebrow">YOUR GARAGE</p>
        <h2 id="cartTitle">Cart</h2>
      </div>
      <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div className="offcanvas-body d-flex flex-column">
      <div id="cartItems" className="cart-items flex-grow-1"></div>
      <div id="cartEmpty" className="cart-empty">
        <i className="bi bi-bag-x"></i>
        <h4>Empty cart</h4>
        <p>Add some exterior-care essentials.</p>
        <button className="btn-dark" data-bs-dismiss="offcanvas">Browse products</button>
      </div>
      <div className="cart-foot d-none" id="cartFooter">
        <div className="ship-bar-wrap" id="shipProgress">
          <p id="shipMessage"></p>
          <div className="ship-track"><span id="shipFill"></span></div>
        </div>
        <div className="cart-row"><span>Subtotal</span><span id="cartSubtotal">₹0</span></div>
        <div className="cart-row"><span>Shipping</span><span id="cartShipping">₹0</span></div>
        <div className="cart-total"><span>Total</span><strong id="cartTotal">₹0</strong></div>
        <button className="btn-lime w-100" id="checkoutBtn">Continue to checkout <i className="bi bi-arrow-right"></i></button>
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
    <div className="modal-dialog modal-dialog-centered modal-sm">
      <div className="modal-content auth-modal">
        <button type="button" className="modal-x" data-bs-dismiss="modal" aria-label="Close"><i className="bi bi-x-lg"></i></button>
        <div className="auth-head">
          <span className="brand-text">Neatify</span><span className="brand-accent">.</span>
          <p id="authNotice" className="auth-notice d-none"><i className="bi bi-shield-lock"></i> Sign in to complete your purchase.</p>
        </div>
        <div className="auth-tabs" role="tablist">
          <button className="auth-tab active" id="authTabLogin" type="button">Sign in</button>
          <button className="auth-tab" id="authTabRegister" type="button">Create account</button>
        </div>
        <p className="auth-error d-none" id="authError"></p>
        <form id="loginForm" novalidate>
          <label>Email<input type="email" id="liEmail" placeholder="you@example.com" autoComplete="email" required /></label>
          <label>Password<span className="pw-wrap"><input type="password" id="liPassword" placeholder="••••••••" autoComplete="current-password" required /><button type="button" className="pw-eye" data-eye="liPassword" aria-label="Show password"><i className="bi bi-eye"></i></button></span></label>
          <button className="btn-lime w-100" type="submit" id="loginBtn">Sign in <i className="bi bi-box-arrow-in-right"></i></button>
        </form>
        <form id="registerForm" className="d-none" novalidate>
          <label>Full name<input type="text" id="rgName" placeholder="Your name" autoComplete="name" required /></label>
          <label>Email<input type="email" id="rgEmail" placeholder="you@example.com" autoComplete="email" required /></label>
          <label>Password<span className="pw-wrap"><input type="password" id="rgPassword" placeholder="Min. 6 characters" autoComplete="new-password" required /><button type="button" className="pw-eye" data-eye="rgPassword" aria-label="Show password"><i className="bi bi-eye"></i></button></span></label>
          <button className="btn-lime w-100" type="submit" id="registerBtn">Create account <i className="bi bi-person-plus"></i></button>
          <p className="auth-fine">One account for checkout, order tracking and faster repeats.</p>
        </form>
      </div>
    </div>
  </div>

  
  <div className="modal fade" id="accountModal" tabIndex="-1" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content account-modal">
        <button type="button" className="modal-x" data-bs-dismiss="modal" aria-label="Close"><i className="bi bi-x-lg"></i></button>
        <div className="row g-0">
          <div className="col-md-4 acc-side">
            <div className="acc-avatar" id="accAvatar">N</div>
            <h3 id="accName">—</h3>
            <p id="accEmail" className="acc-email">—</p>
            <p className="acc-since" id="accSince"></p>
            <div className="acc-tabs" role="tablist">
              <button className="acc-tab active" data-acc="orders" type="button"><i className="bi bi-box-seam"></i> Orders</button>
              <button className="acc-tab" data-acc="profile" type="button"><i className="bi bi-person"></i> Profile</button>
              <button className="acc-tab" data-acc="security" type="button"><i className="bi bi-key"></i> Security</button>
            </div>
            <button className="acc-logout" id="logoutBtn" type="button"><i className="bi bi-box-arrow-right"></i> Sign out</button>
          </div>
          <div className="col-md-8 acc-main">
            <div className="acc-pane active" id="accPaneOrders">
              <h4>Your orders</h4>
              <div id="accOrders" className="acc-orders"></div>
            </div>
            <div className="acc-pane" id="accPaneProfile">
              <h4>Profile details</h4>
              <form id="profileForm" novalidate>
                <label>Full name<input type="text" id="pfName" autoComplete="name" /></label>
                <label>Email <span className="opt">(fixed)</span><input type="email" id="pfEmail" disabled /></label>
                <label>Phone<input type="tel" id="pfPhone" placeholder="+91 98765 43210" autoComplete="tel" /></label>
                <label>Default address<textarea id="pfAddress" rows="3" placeholder="House, street, city, PIN" autoComplete="street-address"></textarea></label>
                <button className="btn-lime" type="submit" id="profileSaveBtn">Save changes <i className="bi bi-check2"></i></button>
              </form>
            </div>
            <div className="acc-pane" id="accPaneSecurity">
              <h4>Change password</h4>
              <form id="passwordForm" novalidate>
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
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content checkout-modal">
        <button type="button" className="modal-x" data-bs-dismiss="modal" aria-label="Close"><i className="bi bi-x-lg"></i></button>
        <div className="row g-0">
          <div className="col-md-7 co-form-side">
            <p className="cart-eyebrow">CHECKOUT</p>
            <h3>Almost there.</h3>
            <p className="co-sub">Fill in your delivery details.</p>
            <form id="checkoutForm" novalidate>
              <div className="field-row">
                <label>Full name<input type="text" id="coName" placeholder="Your name" required autoComplete="name" /><small className="ferr" id="coNameError"></small></label>
                <label>Phone<input type="tel" id="coPhone" placeholder="+91 98765 43210" required autoComplete="tel" /><small className="ferr" id="coPhoneError"></small></label>
              </div>
              <label>Email<input type="email" id="coEmail" placeholder="you@example.com" required autoComplete="email" /><small className="ferr" id="coEmailError"></small></label>
              <label>Delivery address<textarea id="coAddress" rows="3" placeholder="House, street, city, PIN" required autoComplete="street-address"></textarea><small className="ferr" id="coAddressError"></small></label>
              <label>Order notes <span className="opt">(optional)</span><textarea id="coNotes" rows="2" placeholder="Anything we should know?"></textarea></label>
            </form>
          </div>
          <div className="col-md-5 co-summary-side">
            <h4>Order summary</h4>
            <div id="checkoutItems" className="co-items"></div>
            <div className="co-lines">
              <div><span>Subtotal</span><span id="coSubtotal">₹0</span></div>
              <div><span>Shipping</span><span id="coShipping">₹0</span></div>
              <div className="co-grand"><span>Total</span><strong id="coTotal">₹0</strong></div>
            </div>
            <button className="btn-lime w-100" id="placeOrderBtn" form="checkoutForm" type="submit">Place order <i className="bi bi-check2-circle"></i></button>
            <p className="co-note"><i className="bi bi-shield-lock"></i> Demo — no payment charged.</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div className="modal fade" id="orderSuccessModal" tabIndex="-1" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered modal-sm">
      <div className="modal-content info-modal">
        <div className="info-icon success"><i className="bi bi-check-lg"></i></div>
        <h3>Order placed!</h3>
        <p>Thanks for choosing Neatify. Your order has been received.</p>
        <div className="order-chip" id="orderIdChip">ORD-000000</div>
        <button className="btn-dark w-100 mt-3" data-bs-dismiss="modal">Keep browsing</button>
      </div>
    </div>
  </div>
    </>
  );
}
