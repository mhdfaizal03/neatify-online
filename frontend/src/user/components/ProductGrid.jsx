import React from 'react';

export default function ProductGrid() {
  return (
    <>
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
            <button className="f-pill" data-filter="finish" aria-pressed="false">Finish</button>
            <button className="f-pill" data-filter="kit" aria-pressed="false">Kits</button>
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

    
    <section className="bundle-wrap" id="kitOffersContainer" style={{display: 'none'}}>
      <div className="container d-flex flex-column gap-4" id="kitOffersList">
      </div>
    </section>
    </>
  );
}
