import React from "react";
import SmallScreenReservationModal from "../../Modals/SmallScreenReservationModal";

export default function SmallScreenReservationSection({ property }) {
    const [maxGuests, nightlyRate, reservations] = [property.num_guests,
        property.price, property.reservations];

    const formID = "smallScreenReservationForm";

    if ([maxGuests, nightlyRate, reservations].includes(null)
            || [maxGuests, nightlyRate, reservations].includes(undefined)) {
        return null;
    }

    return <>
    <div className="sticky-bottom d-md-none border-top d-flex justify-content-between bg-light p-3">
        <h2>${nightlyRate} CAD <small>night</small></h2>
        <button type="button" data-bs-toggle="modal" data-bs-target="#reservation-menu" className="btn btn-primary">Reserve</button>
    </div>
    <SmallScreenReservationModal maxGuests={maxGuests}
        reservations={reservations} propertyID={property.id} />
    </>;
}