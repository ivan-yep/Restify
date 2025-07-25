import React from "react";

export default function ContactModal({ owner }) {
    return <div className="modal fade" id="contact">
        <div className="modal-dialog modal-dialog-scrollable modal-fullscreen-sm-down">
            <div className="modal-content">

                <div className="modal-header">
                    <h4 className="modal-title">Contact {owner.first_name}</h4>
                    <button type="button" className="btn-close" data-bs-dismiss="modal">
                    </button>
                </div>

                <div className="modal-body d-flex flex-column align-items-center align-content-center">
                    <img src={owner.photo} alt="host" className="rounded-circle border img-fluid justify-self-center align-self-center w-50 my-4" />
                    <h4 className="text-center text-wrap">{owner.first_name + " " + owner.last_name}</h4>
                    <h4 className="text-center text-wrap">{owner.email}</h4>
                    <h4 className="text-center text-wrap">{owner.tel}</h4>
                    {/* <h4 className="text-center text-wrap">266 King asdfassd St W, Toronto, ON M5V 1H8</h4> */}
                </div>
            </div>
        </div>
    </div>;
}