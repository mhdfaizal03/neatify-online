import React from 'react';

export default function Hero() {
  return (
    <>
      
    
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
    </>
  );
}
