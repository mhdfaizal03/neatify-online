import React from 'react';

export default function Process() {
  const processSteps = [
    { n: '01', icon: 'bi-droplet-half', title: 'Pre-rinse', desc: 'Knock away loose grit before touching the paint.' },
    { n: '02', icon: 'bi-cloud-haze2', title: 'Foam', desc: 'Lay down rich snow foam and let it lift the dirt.' },
    { n: '03', icon: 'bi-hand-index-thumb', title: 'Touch', desc: 'Work with a soft mitt using gentle circular passes.' },
    { n: '04', icon: 'bi-stars', title: 'Finish', desc: 'Dry with microfiber and reveal a clean mirror gloss.' },
  ];

  const whyFeatures = [
    { icon: 'bi-shield-check', title: 'Paint-conscious formulas', desc: 'Designed around a careful exterior wash routine that protects your paint.' },
    { icon: 'bi-lightning-charge', title: 'Purpose-built tools', desc: 'Simple accessories that make the job cleaner and more enjoyable.' },
    { icon: 'bi-box-seam', title: 'Small range, clear purpose', desc: 'No endless shelf. Just products with a job to do.' },
  ];

  const reviews = [
    { text: 'The foam is the fun part. The vehicle looks noticeably cleaner without making the routine complicated.', name: 'Rahul M.', role: 'Weekend detailer', initials: 'RM' },
    { text: 'Everything feels like it belongs together. The sprayer, towel and wash make a great starter setup.', name: 'Priya K.', role: 'Neatify customer', initials: 'PK', hero: true },
    { text: 'Finally a vehicle-care range that looks as good on the shelf as it does on the vehicle.', name: 'Arun T.', role: 'Vehicle enthusiast', initials: 'AT' },
  ];

  const faqs = [
    { id: 'faq1', q: 'What is the Neatify Clean+ Foam Wash for?', a: 'An exterior vehicle wash shampoo that creates rich foam to lift grit and support a clean, glossy wash routine.', open: true },
    { id: 'faq2', q: 'Can I use the pressure foam sprayer without a pressure washer?', a: "Yes. It's a manual pressure foam sprayer — fill, pressurize and use the adjustable nozzle to apply foam." },
    { id: 'faq3', q: 'Is the interior range available now?', a: 'Not yet. Interior care is an upcoming range — the current storefront focuses on exterior cleaning.' },
    { id: 'faq4', q: 'Can I buy a complete cleaning setup?', a: 'Yes. Use the Weekend Kit or add individual products to build your own exterior-care setup.' },
    { id: 'faq5', q: 'Do you offer free shipping?', a: 'Free shipping on orders above ₹999. Standard delivery 3–5 business days across India.', hasThreshold: true },
  ];

  return (
    <>
      {/* ── Process / How It Works ── */}
      <section className="sec process-sec" id="how-it-works">
        <div className="container">
          <div className="process-intro reveal" style={{ marginBottom: '3.5rem' }}>
            <p className="sec-eyebrow">SIMPLE BY DESIGN</p>
            <h2 className="sec-title">Your clean in <em>four moves.</em></h2>
            <p className="sec-sub" style={{ marginTop: '1rem', maxWidth: '460px' }}>
              No complicated setup. The right product at the right moment.
            </p>
          </div>
          <div className="process-steps reveal">
            {processSteps.map((step) => (
              <div key={step.n} className="process-step">
                <div className="ps-number">{step.n}</div>
                <div className="ps-icon"><i className={`bi ${step.icon}`}></i></div>
                <h3 className="ps-title">{step.title}</h3>
                <p className="ps-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Interior Teaser ── */}
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
              <img className="art-photo" src="/assets/interior-teaser.png" alt="Premium vehicle interior bathed in lime accent light" loading="lazy" />
              <div className="art-glow"></div>
              <span className="art-tag">INTERIOR / 02</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Neatify (Story) ── */}
      <section className="sec why-sec" id="story">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-5 reveal">
              <div className="why-visual">
                <img src="/assets/product-2.jpeg" alt="Neatify Pressure Foam Sprayer" />
                <div className="why-stat">
                  <span className="why-stat-num">4.9★</span>
                  <span className="why-stat-label">Avg. rating</span>
                </div>
                <div className="why-stat why-stat-2">
                  <span className="why-stat-num">500+</span>
                  <span className="why-stat-label">Happy cars</span>
                </div>
              </div>
            </div>
            <div className="col-lg-7 reveal">
              <p className="sec-eyebrow">WHY NEATIFY</p>
              <h2 className="sec-title dark">Less fuss.<br /><em>More finish.</em></h2>
              <p className="story-lead">Vehicle care should feel satisfying — not like a chemistry exam.</p>
              <div className="why-features">
                {whyFeatures.map((feat, i) => (
                  <div key={i} className="why-feat">
                    <div className="why-feat-icon"><i className={`bi ${feat.icon}`}></i></div>
                    <div>
                      <h4>{feat.title}</h4>
                      <p>{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
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
            {reviews.map((r, i) => (
              <div key={i} className="col-md-4 reveal">
                <article className={`review-card ${r.hero ? 'review-hero' : ''}`}>
                  <div className="rev-stars">★★★★★</div>
                  <p>"{r.text}"</p>
                  <div className="rev-author">
                    <div className="rev-avatar">{r.initials}</div>
                    <div className="rev-author-info">
                      <strong>{r.name}</strong>
                      <span>{r.role}</span>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="sec faq-sec" id="faq">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-4 reveal">
              <p className="sec-eyebrow">NEED TO KNOW</p>
              <h2 className="sec-title dark">Questions,<br /><em>answered.</em></h2>
              <p className="story-lead" style={{ marginTop: '1rem', marginBottom: 0 }}>
                Start with the foam wash, then build from there.
              </p>
              <a
                data-whatsapp-link="question"
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="faq-wa-cta"
              >
                <i className="bi bi-whatsapp"></i>
                <span>Ask us on WhatsApp</span>
              </a>
            </div>
            <div className="col-lg-8 reveal">
              <div className="accordion neat-acc" id="faqAccordion">
                {faqs.map((faq) => (
                  <div key={faq.id} className="accordion-item">
                    <h3 className="accordion-header">
                      <button
                        className={`accordion-button ${faq.open ? '' : 'collapsed'}`}
                        data-bs-toggle="collapse"
                        data-bs-target={`#${faq.id}`}
                      >
                        {faq.q}
                      </button>
                    </h3>
                    <div
                      id={faq.id}
                      className={`accordion-collapse collapse ${faq.open ? 'show' : ''}`}
                      data-bs-parent="#faqAccordion"
                    >
                      <div className="accordion-body">
                        {faq.hasThreshold ? (
                          <>Free shipping on orders above <span id="faqShipThreshold">₹999</span>. Standard delivery 3–5 business days across India.</>
                        ) : faq.a}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="news-sec">
        <div className="container">
          <div className="news-card reveal">
            <div className="news-copy">
              <p className="sec-eyebrow">NEATIFY NOTES</p>
              <h2>Stay in the<br />clean loop.</h2>
              <p>Product drops, care tips and interior launch updates — no noise.</p>
            </div>
            <form id="newsletterForm" className="news-form" noValidate>
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
