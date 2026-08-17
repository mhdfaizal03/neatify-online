import React from 'react';

export default function AdminSettings() {
  return (
    <>
      <section className="view" id="view-settings">
          <div className="page-head">
            <div>
              <h2>Store Settings</h2>
              <p>Global configurations</p>
            </div>
            <button className="btn-primary" id="saveSettingsBtn"><i className="bi bi-check-lg"></i> Save Settings</button>
          </div>
          <form className="settings-form" id="settingsForm">
            <div className="form-grid">
              <label>Store Name
                <input type="text" name="storeName" placeholder="e.g. Neatify" />
              </label>
              <label>Free Shipping Threshold (₹)
                <input type="number" name="freeShippingThreshold" min="0" />
              </label>
              <label className="full">Announcement Bar Text
                <input type="text" name="announcement" placeholder="Main banner text" />
              </label>
              <label className="full">Announcement Subtext
                <input type="text" name="announcementSub" placeholder="Smaller banner text" />
              </label>
              <label className="full">Marquee Keywords (comma separated)
                <textarea name="marqueeKeywords" placeholder="DEEP DIRT LIFT, PAINT-SAFE FORMULA..." rows="3"></textarea>
              </label>
              <label>Weekend Kit IDs (CSV)
                <input type="text" name="weekendKitIds" placeholder="1, 2, 4, 7" />
              </label>
              <label>Featured Product ID
                <input type="number" name="highlightProductId" min="1" />
              </label>
            </div>
          </form>
        </section>
    </>
  );
}
