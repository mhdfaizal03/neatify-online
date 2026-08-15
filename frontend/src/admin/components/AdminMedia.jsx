import React from 'react';

export default function AdminMedia() {
  return (
    <>
      <section className="view" id="view-media">
          <div className="page-head">
            <div>
              <h2>Media Library</h2>
              <p>Asset management</p>
            </div>
            <label className="btn-primary upload-btn" htmlFor="mediaUpload">
              <i className="bi bi-cloud-upload"></i> Upload Image
              <input type="file" id="mediaUpload" accept="image/*" hidden />
            </label>
          </div>
          <div className="media-grid" id="mediaGrid">
            
          </div>
        </section>
    </>
  );
}
