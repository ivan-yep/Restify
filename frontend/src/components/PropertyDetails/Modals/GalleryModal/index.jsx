import React from "react";
import GalleryCarousel from "./GalleryCarousel";

export default function GalleryModal({ images }) {
    return <div className="modal fade" id="images">
    <div className="modal-dialog modal-dialog-scrollable modal-fullscreen">
      <div className="modal-content">

        <div className="modal-header">
          <h4 className="modal-title">Gallery</h4>
          <button type="button" className="btn-close" data-bs-dismiss="modal">
          </button>
        </div>

        <div className="modal-body">
            <GalleryCarousel images={images} />
        </div>
      </div>
    </div>
  </div>;
}