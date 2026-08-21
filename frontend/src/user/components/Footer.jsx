import React from 'react';

export default function Footer() {
  return (
    <>
      <footer className="site-footer">
    <div className="container">
      <div className="row g-4">
        <div className="col-lg-5">
          <a className="foot-brand" href="/">Neatify<span>.</span></a>
          <p className="foot-tagline">Clean. Shine. Protect.<br />Exterior care for vehicles that deserve it.</p>
          <div className="socials">
            <a href="#" aria-label="Instagram"><i className="bi bi-instagram"></i></a>
            <a href="#" aria-label="Facebook"><i className="bi bi-facebook"></i></a>
            <a href="#" aria-label="YouTube"><i className="bi bi-youtube"></i></a>
          </div>
        </div>
        <div className="col-6 col-lg-2">
          <h5>Explore</h5>
          <a href="/#shop">Shop</a>
          <a href="/#how-it-works">Process</a>
          <a href="/#story">About</a>
        </div>
        <div className="col-6 col-lg-2">
          <h5>Support</h5>
          <a href="/#faq">FAQ</a>
          <a href="/#shop">Products</a>
          <a href="/#faq">Shipping</a>
        </div>
        <div className="col-lg-3">
          <h5>Coming next</h5>
          <p className="foot-note">Interior care is in development.</p>
          <button className="foot-cta" id="footerNotify">Get launch alert <i className="bi bi-arrow-right"></i></button>
        </div>
      </div>
      <div className="foot-bottom">
        <span>© 2026 Neatify. All rights reserved.</span>
        <span>Made for clean drives.</span>
      </div>
    </div>
  </footer>

  
  <button className="btt" id="backToTop" aria-label="Back to top"><i className="bi bi-arrow-up"></i></button>
    </>
  );
}
