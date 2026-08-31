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
            <a href="https://wa.me/918113001959?text=Hello%20Neatify%20Car%20Care" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Support"><i className="bi bi-whatsapp"></i></a>
            <a href="#" aria-label="Instagram"><i className="bi bi-instagram"></i></a>
            <a href="#" aria-label="Facebook"><i className="bi bi-facebook"></i></a>
            <a href="#" aria-label="YouTube"><i className="bi bi-youtube"></i></a>
          </div>
          <div className="mt-3">
            <a 
              href="https://wa.me/918113001959?text=Hello%20Neatify%20Car%20Care,%20I%20would%20like%20to%20order%20or%20inquire%20about%20your%20products." 
              target="_blank" 
              rel="noopener noreferrer" 
              className="foot-wa-link d-inline-flex align-items-center gap-2 text-decoration-none"
              style={{ fontSize: '0.86rem', color: '#a1a1aa', transition: 'color 0.2s ease' }}
            >
              <i className="bi bi-whatsapp text-success fs-6"></i>
              <span>Direct WhatsApp Order: <strong>+91 8113001959</strong></span>
            </a>
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
          <a href="https://wa.me/918113001959?text=Hello%20Neatify,%20I%20need%20support%20with%20my%20order." target="_blank" rel="noopener noreferrer">Order Support</a>
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
