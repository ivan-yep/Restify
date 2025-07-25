import React from "react";
import ContactModal from "../Modals/ContactModal";

export default function ContactSection({ owner }) {
    if (owner === null || owner === undefined) {
        return null;
    }
    return <>
    <div className="container d-flex flex-column border-top border-secondary py-4" id="host-section">
        <div className="row">
            <div className="col-8">
                <h4>Hosted by {owner.first_name + " " + owner.last_name}</h4>
                {/* <h6>Joined in February 2023</h6> */}
            </div>
            <button data-bs-toggle="modal" data-bs-target="#contact" className="col border-0 bg-transparent mb-3">
                <img src={owner.photo} alt="host" className="rounded-circle border img-fluid w-75" />
            </button>
        </div>
        <button type="button" data-bs-toggle="modal" data-bs-target="#contact" className="btn btn-primary">Contact</button>
    </div>
    <ContactModal owner={owner} />
    </>;
}