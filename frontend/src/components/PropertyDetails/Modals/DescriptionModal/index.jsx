import React from "react";

export default function DescriptionModal({ description }) {
    return <div className="modal fade" id="description">
        <div className="modal-dialog modal-dialog-scrollable modal-fullscreen-sm-down modal-lg">
            <div className="modal-content">

                <div className="modal-header">
                    <h4 className="modal-title">About this property</h4>
                    <button type="button" className="btn-close" data-bs-dismiss="modal">
                    </button>
                </div>

                <div className="modal-body">
                    {description}
                </div>
            </div>
        </div>
    </div>;
}