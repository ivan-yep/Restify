import React from "react";

export default function AmenitiesModal({ amenities }) {
    return <div className="modal fade" id="amenities">
    <div className="modal-dialog modal-dialog-scrollable modal-fullscreen-sm-down modal-lg">
      <div className="modal-content">

        <div className="modal-header">
          <h4 className="modal-title">Amenities</h4>
          <button type="button" className="btn-close" data-bs-dismiss="modal">
          </button>
        </div>

        <div className="modal-body d-flex flex-row flex-wrap">
            {amenities.map(amenity => (
                <li key={amenity.amenity}
                className="list-group-item border-0 bg-transparent col-6 my-2">
                    {amenity.amenity}
                </li>
            ))}
        </div>

      </div>
    </div>
  </div>;
}