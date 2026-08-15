import React from 'react';

export default function Modals() {
  return (
    <>
      <div className="ann-pop" id="annPop" role="dialog" aria-live="polite" aria-label="Store announcement">
    <span className="ann-dot"></span>
    <div className="ann-pop-copy">
      <strong id="announceMain">Premium vehicle care, made simple.</strong>
      <span id="announceSub">Free shipping on orders above ₹999.</span>
    </div>
    <button className="ann-pop-x" id="annPopClose" aria-label="Dismiss announcement"><i className="bi bi-x-lg"></i></button>
  </div>

  
  <nav className="navbar navbar-expand-lg" id="mainNav">
    <div className="container">
      <a className="nav-brand" href="#home" aria-label="Neatify">
        <span className="brand-text">Neatify</span>
        <span className="brand-accent">.</span>
      </a>

      <div className="collapse navbar-collapse" id="navMenu">
        <ul className="navbar-nav mx-auto gap-1">
          <li className="nav-item"><a className="nav-link active" href="#home">Home</a></li>
          <li className="nav-item"><a className="nav-link" href="#shop">Shop</a></li>
          <li className="nav-item"><a className="nav-link" href="#how-it-works">Process</a></li>
          <li className="nav-item"><a className="nav-link" href="#story">About</a></li>
          <li className="nav-item"><a className="nav-link" href="#faq">FAQ</a></li>
        </ul>
      </div>

      <div className="nav-end d-flex align-items-center gap-2">
        <button className="icon-btn" id="searchToggle" aria-label="Search">
          <i className="bi bi-search"></i>
        </button>
        <button className="icon-btn" id="accountBtn" aria-label="Account">
          <i className="bi bi-person-circle" id="accountIcon"></i>
        </button>
        <button className="icon-btn cart-btn" id="cartToggle" aria-label="Cart">
          <i className="bi bi-bag"></i>
          <span className="cart-badge" id="cartCount">0</span>
        </button>
        <a className="btn-primary-sm d-none d-lg-inline-flex" href="#shop">Shop Now</a>
      </div>

      <button className="nav-burger" type="button" id="navBurger" aria-controls="navDrawer" aria-expanded="false" aria-label="Open menu">
        <i className="bi bi-list"></i>
      </button>
    </div>
  </nav>

  
  <div className="nav-scrim" id="navScrim"></div>
  <aside className="nav-drawer" id="navDrawer" aria-hidden="true">
    <div className="nav-drawer-head">
      <span className="drawer-brand">Neatify<span className="brand-accent">.</span></span>
      <button className="ann-pop-x" id="navDrawerClose" aria-label="Close menu"><i className="bi bi-x-lg"></i></button>
    </div>
    <nav className="nav-drawer-links" aria-label="Mobile navigation">
      <a href="#home" className="drawer-link active">Home</a>
      <a href="#shop" className="drawer-link">Shop</a>
      <a href="#how-it-works" className="drawer-link">Process</a>
      <a href="#story" className="drawer-link">About</a>
      <a href="#faq" className="drawer-link">FAQ</a>
    </nav>
    <div className="nav-drawer-foot">
      <a className="btn-primary-sm" href="#shop">Shop Now</a>
      <p className="drawer-note">Premium vehicle care, made simple.</p>
    </div>
  </aside>

  
  <div className="search-bar" id="searchPanel">
    <div className="container py-3">
      <div className="search-field">
        <i className="bi bi-search"></i>
        <input id="searchInput" type="search" placeholder="Search products…" autoComplete="off" aria-label="Search" />
        <button className="icon-btn" id="searchClose"><i className="bi bi-x-lg"></i></button>
      </div>
      <div id="searchResults" className="search-drop" role="listbox" aria-live="polite"></div>
    </div>
  </div>

  <main id="home">
    
    <section className="hero" id="heroSection">
      <div className="hero-scroll-space">
        
        <div className="snap-mark" aria-hidden="true"></div>
        <div className="snap-mark snap-mark-2" aria-hidden="true"></div>
        <div className="hero-sticky">
          <div className="hero-orb orb-blue"></div>
          <div className="hero-orb orb-lime"></div>
          <canvas id="heroCanvas" role="img" aria-label="3D rotating product model"></canvas>
          <div className="hero-mesh"></div>
          <div className="hero-vignette"></div>

          
          <div className="hero-stages-wrap">
            <div className="container">
              <div className="hero-stages-inner">

                <div className="hero-stage active" data-stage="0">
                  <div className="stage-label"><span className="label-line"></span><span>01 / EXTERIOR CARE</span></div>
                  <h1 className="hero-h1">Make your vehicle<br /><em>look freshly born.</em></h1>
                  <p className="hero-sub">A high-performance exterior system for deep cleaning, rich foam and a mirror-gloss finish. Scroll — the model does the talking.</p>
                  <div className="hero-actions">
                    <a className="btn-hero-primary" href="#shop">Explore the range <i className="bi bi-arrow-right"></i></a>
                    <a className="btn-hero-ghost" href="#how-it-works">See the process</a>
                  </div>
                  <div className="hero-meta">
                    <div className="meta-item"><div className="meta-stars">★★★★★</div><span>4.9 rating</span></div>
                    <div className="meta-divider"></div>
                    <div className="meta-item"><i className="bi bi-people"></i><span>2,300+ washes</span></div>
                    <div className="meta-divider"></div>
                    <div className="meta-item"><i className="bi bi-truck"></i><span>Free ship <span id="heroShipNote">₹999</span>+</span></div>
                  </div>
                </div>

                <div className="hero-stage" data-stage="1">
                  <div className="stage-label"><span className="label-line"></span><span>02 / FOAM WASH</span></div>
                  <h2 className="hero-h1">Snow foam.<br /><em>Zero scrubbing.</em></h2>
                  <p className="hero-sub">Clean+ Foam Wash lays down a thick, paint-safe blanket that lifts grit away before your mitt touches the surface.</p>
                  <div className="hero-actions">
                    <a className="btn-hero-primary" href="#shop">Shop foam wash <i className="bi bi-droplet-half"></i></a>
                  </div>
                </div>

                <div className="hero-stage stage-center" data-stage="2">
                  <div className="stage-label"><span className="label-line"></span><span>03 / MIRROR GLOSS</span></div>
                  <h2 className="hero-h1">Finish with<br /><em>mirror gloss.</em></h2>
                  <p className="hero-sub">Dry with premium microfiber, step back and admire. Your entire routine, one shelf.</p>
                  <div className="hero-actions">
                    <a className="btn-hero-primary" href="#shop">Build your routine <i className="bi bi-stars"></i></a>
                    <button className="btn-hero-ghost" id="heroKitBtn">Add weekend kit</button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          
          <div className="hero-fallback d-none" id="heroFallback">
            <img src="assets/hero-bottle.jpg" alt="Neatify Foam Wash" />
          </div>

          
          <nav className="hero-rail" aria-label="Hero stages">
            <span className="rail-dot active" data-rail="0"></span>
            <span className="rail-track"><span id="heroProgressFill"></span></span>
            <span className="rail-dot" data-rail="1"></span>
            <span className="rail-track"><span></span></span>
            <span className="rail-dot" data-rail="2"></span>
          </nav>

          
          <div className="model-loader" id="modelLoader" role="status">
            <span className="loader-spin"></span>
            <span id="modelLoaderText">Loading 3D…</span>
          </div>

          
          <div className="scroll-hint" id="scrollCue">
            <span className="hint-line"></span>
            <span>Scroll</span>
          </div>
        </div>
      </div>
      <div id="heroStatus" className="sr-only" aria-live="polite" aria-atomic="true">Stage 1 of 3</div>
    </section>

    
    <div className="marquee-strip" role="marquee" aria-label="Key benefits">
      <div className="marquee-track">
        <div className="marquee-group">
          <span>DEEP DIRT LIFT</span><span className="dot">◆</span>
          <span>PAINT-SAFE FORMULA</span><span className="dot">◆</span>
          <span>THICK CLINGING FOAM</span><span className="dot">◆</span>
          <span>CRYSTAL GLOSS FINISH</span><span className="dot">◆</span>
          <span>pH-NEUTRAL &amp; WAX-SAFE</span><span className="dot">◆</span>
          <span>STREAK-FREE EVERY TIME</span><span className="dot">◆</span>
        </div>
        <div className="marquee-group" aria-hidden="true">
          <span>DEEP DIRT LIFT</span><span className="dot">◆</span>
          <span>PAINT-SAFE FORMULA</span><span className="dot">◆</span>
          <span>THICK CLINGING FOAM</span><span className="dot">◆</span>
          <span>CRYSTAL GLOSS FINISH</span><span className="dot">◆</span>
          <span>pH-NEUTRAL &amp; WAX-SAFE</span><span className="dot">◆</span>
          <span>STREAK-FREE EVERY TIME</span><span className="dot">◆</span>
        </div>
      </div>
    </div>

    
    <section className="sec" id="shop">
      <div className="container">
        <div className="sec-head row align-items-end reveal">
          <div className="col-lg-8">
            <p className="sec-eyebrow">THE EXTERIOR EDIT</p>
            <h2 className="sec-title">Everything your <em>outside</em> needs.</h2>
          </div>
          <div className="col-lg-4 text-lg-end">
            <p className="sec-sub">Build a wash routine with the essentials: foam, pressure, touch and finish.</p>
          </div>
        </div>

        <div className="shop-bar reveal">
          <div className="filter-row" id="filterPills" role="group" aria-label="Filter by category">
            <button className="f-pill active" data-filter="all" aria-pressed="true">All</button>
            <button className="f-pill" data-filter="wash" aria-pressed="false">Wash</button>
            <button className="f-pill" data-filter="tools" aria-pressed="false">Tools</button>
            <button className="f-pill" data-filter="kit" aria-pressed="false">Kits</button>
            <button className="f-pill" data-filter="finish" aria-pressed="false">Finish</button>
          </div>
          <select id="sortSelect" className="sort-dd" aria-label="Sort products">
            <option value="featured">Featured</option>
            <option value="low">Price ↑</option>
            <option value="high">Price ↓</option>
            <option value="name">A – Z</option>
          </select>
        </div>

        <div className="row g-3" id="productGrid"></div>
        <div className="no-results d-none" id="emptyState">
          <i className="bi bi-search"></i>
          <h3 id="emptyStateTitle">No products found</h3>
          <p id="emptyStateText">Try another search or category.</p>
          <button className="btn-lime btn-lime-sm d-none" id="retryProducts">Try again</button>
        </div>
      </div>
    </section>

    
    <section className="bundle-wrap">
      <div className="container">
        <div className="bundle-card reveal">
          <div className="bundle-copy">
            <p className="sec-eyebrow">THE WEEKEND KIT</p>
            <h2 className="bundle-title">Wash it.<br /><em>Own the shine.</em></h2>
            <p className="bundle-desc">One focused setup for your weekend detail. Foam, tools and premium microfiber essentials in one kit.</p>
            <div className="bundle-foot">
              <button className="btn-lime" id="bundleBtn">Add the kit <i className="bi bi-plus"></i></button>
              <span className="bundle-price" id="bundlePrice"></span>
            </div>
          </div>
          <div className="bundle-img-wrap">
            <img src="assets/product-3.jpeg" alt="Neatify exterior kit" id="bundleImage" />
          </div>
        </div>
      </div>
    </section>

    
    <section className="sec process-sec" id="how-it-works">
      <div className="container">
        <div className="text-center reveal">
          <p className="sec-eyebrow justify-content-center">SIMPLE BY DESIGN</p>
          <h2 className="sec-title">Your clean in <em>four moves.</em></h2>
          <p className="sec-sub mx-auto" style={{ maxWidth: '480px' }}>No complicated detailing setup. Just the right product at the right moment.</p>
        </div>
        <div className="process-grid">
          <div className="process-line"></div>
          <div className="row g-4 position-relative">
            <div className="col-md-6 col-lg-3 reveal">
              <div className="step-card">
                <span className="step-n">01</span>
                <div className="step-icon"><i className="bi bi-droplet-half"></i></div>
                <h3>Pre-rinse</h3>
                <p>Knock away loose grit before touching the paint.</p>
              </div>
            </div>
            <div className="col-md-6 col-lg-3 reveal">
              <div className="step-card">
                <span className="step-n">02</span>
                <div className="step-icon"><i className="bi bi-cloud-haze2"></i></div>
                <h3>Foam</h3>
                <p>Lay down rich foam and let it lift the dirt.</p>
              </div>
            </div>
            <div className="col-md-6 col-lg-3 reveal">
              <div className="step-card">
                <span className="step-n">03</span>
                <div className="step-icon"><i className="bi bi-hand-index-thumb"></i></div>
                <h3>Touch</h3>
                <p>Work with a soft mitt using gentle passes.</p>
              </div>
            </div>
            <div className="col-md-6 col-lg-3 reveal">
              <div className="step-card">
                <span className="step-n">04</span>
                <div className="step-icon"><i className="bi bi-stars"></i></div>
                <h3>Finish</h3>
                <p>Dry with microfiber and reveal clean gloss.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    
    <section className="interior-sec">
      <div className="container">
        <div className="interior-card reveal">
          <div className="interior-copy">
            <p className="sec-eyebrow">COMING SOON · NEXT CHAPTER</p>
            <h2 className="sec-title">Interior care is<br /><em>on the way.</em></h2>
            <p className="interior-desc">Dedicated interior products for dashboards, fabrics, glass and cabin mess. Exterior first. Interior next.</p>
            <button className="btn-outline-lime" id="notifyBtn">Get notified <i className="bi bi-bell"></i></button>
          </div>
          <div className="interior-art">
            <img className="art-photo" src="assets/interior-teaser.png" alt="Premium vehicle interior bathed in lime accent light" loading="lazy" />
            <div className="art-glow"></div>
            <span className="art-tag">INTERIOR / 02</span>
          </div>
        </div>
      </div>
    </section>

    
    <section className="sec" id="story">
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6 reveal">
            <div className="story-photo">
              <img src="assets/product-10.jpeg" alt="Neatify Clean+ Foam Wash" />
            </div>
          </div>
          <div className="col-lg-6 reveal">
            <p className="sec-eyebrow">WHY NEATIFY</p>
            <h2 className="sec-title dark">Less fuss.<br /><em>More finish.</em></h2>
            <p className="story-lead">Vehicle care should feel satisfying — not like a chemistry exam.</p>
            <div className="feat-list">
              <div className="feat-row">
                <span className="feat-icon"><i className="bi bi-shield-check"></i></span>
                <div>
                  <h4>Paint-conscious formulas</h4>
                  <p>Designed around a careful exterior wash routine.</p>
                </div>
              </div>
              <div className="feat-row">
                <span className="feat-icon"><i className="bi bi-lightning-charge"></i></span>
                <div>
                  <h4>Purpose-built tools</h4>
                  <p>Simple accessories that make the job cleaner.</p>
                </div>
              </div>
              <div className="feat-row">
                <span className="feat-icon"><i className="bi bi-box-seam"></i></span>
                <div>
                  <h4>Small range, clear purpose</h4>
                  <p>No endless shelf. Just products with a job to do.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    
    <section className="reviews-sec">
      <div className="container">
        <div className="row align-items-end sec-head reveal">
          <div className="col-lg-6">
            <p className="sec-eyebrow">REAL CLEAN ENERGY</p>
            <h2 className="sec-title">Looks good.<br /><em>Feels better.</em></h2>
          </div>
          <div className="col-lg-6 text-lg-end">
            <p className="sec-sub" style={{ marginLeft: 'auto' }}>Easy steps, satisfying foam and a finish you notice.</p>
          </div>
        </div>
        <div className="row g-3">
          <div className="col-md-4 reveal">
            <article className="review-card">
              <div className="rev-stars">★★★★★</div>
              <p>"The foam is the fun part. The vehicle looks noticeably cleaner without making the routine complicated."</p>
              <span>— Weekend detailer</span>
            </article>
          </div>
          <div className="col-md-4 reveal">
            <article className="review-card review-hero">
              <div className="rev-stars">★★★★★</div>
              <p>"Everything feels like it belongs together. The sprayer, towel and wash make a great starter setup."</p>
              <span>— Neatify customer</span>
            </article>
          </div>
          <div className="col-md-4 reveal">
            <article className="review-card">
              <div className="rev-stars">★★★★★</div>
              <p>"Finally a vehicle-care range that looks as good on the shelf as it does on the vehicle."</p>
              <span>— Vehicle enthusiast</span>
            </article>
          </div>
        </div>
      </div>
    </section>

    
    <section className="sec faq-sec" id="faq">
      <div className="container">
        <div className="row g-5">
          <div className="col-lg-4 reveal">
            <p className="sec-eyebrow">NEED TO KNOW</p>
            <h2 className="sec-title dark">Questions,<br /><em>answered.</em></h2>
            <p className="story-lead">Start with the foam wash, then build from there.</p>
          </div>
          <div className="col-lg-8 reveal">
            <div className="accordion neat-acc" id="faqAccordion">
              <div className="accordion-item">
                <h3 className="accordion-header"><button className="accordion-button" data-bs-toggle="collapse" data-bs-target="#faq1">What is the Neatify Clean+ Foam Wash for?</button></h3>
                <div id="faq1" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                  <div className="accordion-body">An exterior vehicle wash shampoo that creates rich foam to lift grit and support a clean, glossy wash routine.</div>
                </div>
              </div>
              <div className="accordion-item">
                <h3 className="accordion-header"><button className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#faq2">Can I use the pressure foam sprayer without a pressure washer?</button></h3>
                <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                  <div className="accordion-body">Yes. It's a manual pressure foam sprayer — fill, pressurize and use the adjustable nozzle to apply foam.</div>
                </div>
              </div>
              <div className="accordion-item">
                <h3 className="accordion-header"><button className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#faq3">Is the interior range available now?</button></h3>
                <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                  <div className="accordion-body">Not yet. Interior care is an upcoming range — the current storefront focuses on exterior cleaning.</div>
                </div>
              </div>
              <div className="accordion-item">
                <h3 className="accordion-header"><button className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#faq4">Can I buy a complete cleaning setup?</button></h3>
                <div id="faq4" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                  <div className="accordion-body">Yes. Use the Weekend Kit or add individual products to build your own exterior-care setup.</div>
                </div>
              </div>
              <div className="accordion-item">
                <h3 className="accordion-header"><button className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#faq5">Do you offer free shipping?</button></h3>
                <div id="faq5" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                  <div className="accordion-body">Free shipping on orders above <span id="faqShipThreshold">₹999</span>. Standard delivery 3–5 business days across India.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    
    <section className="news-sec">
      <div className="container">
        <div className="news-card reveal">
          <div className="news-copy">
            <p className="sec-eyebrow">NEATIFY NOTES</p>
            <h2>Stay in the<br />clean loop.</h2>
            <p>Product drops, care tips and interior launch updates — no noise.</p>
          </div>
          <form id="newsletterForm" className="news-form" novalidate>
            <label className="visually-hidden" htmlFor="emailInput">Email address</label>
            <input id="emailInput" type="email" placeholder="Your email address" required autoComplete="email" />
            <button className="btn-dark" type="submit" id="newsletterBtn">Join <i className="bi bi-arrow-right"></i></button>
          </form>
        </div>
      </div>
    </section>
  </main>

  
  <footer className="site-footer">
    <div className="container">
      <div className="row g-4">
        <div className="col-lg-5">
          <a className="foot-brand" href="#home">Neatify<span>.</span></a>
          <p className="foot-tagline">Clean. Shine. Protect.<br />Exterior care for vehicles that deserve it.</p>
          <div className="socials">
            <a href="#" aria-label="Instagram"><i className="bi bi-instagram"></i></a>
            <a href="#" aria-label="Facebook"><i className="bi bi-facebook"></i></a>
            <a href="#" aria-label="YouTube"><i className="bi bi-youtube"></i></a>
          </div>
        </div>
        <div className="col-6 col-lg-2">
          <h5>Explore</h5>
          <a href="#shop">Shop</a>
          <a href="#how-it-works">Process</a>
          <a href="#story">About</a>
        </div>
        <div className="col-6 col-lg-2">
          <h5>Support</h5>
          <a href="#faq">FAQ</a>
          <a href="#shop">Products</a>
          <a href="#faq5">Shipping</a>
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
    </>
  );
}
