import React from 'react';

export default function Process() {
  return (
    <>
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
  
    </>
  );
}
