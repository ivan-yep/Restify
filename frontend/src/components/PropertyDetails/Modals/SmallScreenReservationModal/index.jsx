import React from "react";
import ReservationForm from "../../ReservationMenu/ReservationForm";

export default function SmallScreenReservationModal(
                            { maxGuests, reservations, propertyID }) {

    const formID = "smallScreenReservationForm";

    return <div className="modal fade" id="reservation-menu">
        <div className="modal-dialog modal-dialog-scrollable modal-fullscreen-sm-down">
            <div className="modal-content">

                <div className="modal-header">
                    <h4 className="modal-title">Your stay</h4>
                    <button id="close-small-screen-reservation-modal" type="button" className="btn-close" data-bs-dismiss="modal">
                    </button>
                </div>

                <div className="modal-body">
                    <ReservationForm formID={formID} maxGuests={maxGuests}
                        reservations={reservations} propertyID={propertyID}/>
                </div>

                <div className="modal-footer d-flex ">
                    <button type="submit" form={formID} role="button"
                    className="flex-fill btn btn-primary">
                        RESERVE
                    </button>
                </div>

            </div>
        </div>
    </div>;
}