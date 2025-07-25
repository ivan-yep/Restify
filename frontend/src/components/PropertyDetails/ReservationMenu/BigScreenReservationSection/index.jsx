import React from "react";
import ReservationForm from "../ReservationForm";

export default function BigScreenReservationSection({ property }) {
    const [maxGuests, nightlyRate, reservations] = [property.num_guests,
                                        property.price, property.reservations];
    const formID = "bigScreenReservationForm";

    if ([maxGuests, nightlyRate, reservations].includes(null)
            || [maxGuests, nightlyRate, reservations].includes(undefined)) {
        return null;
    }

    return <div className="container d-none d-md-flex flex-column justify-content-between h-75 w-50 sticky-top border border-secondary rounded ms-5 p-4" id="big-scr-reservation">
        <h4 className="mb-3">
            ${nightlyRate} CAD <small>night</small>
        </h4>
        
        <ReservationForm formID={formID} maxGuests={maxGuests}
            reservations={reservations} propertyID={property.id} />
        <div className="d-flex">
            <button type="submit" form={formID} role="button"
                    className="flex-fill flex-fill mt-3 btn btn-primary">
                RESERVE
            </button>
        </div>
    </div>;
}