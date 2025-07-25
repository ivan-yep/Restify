import React, { useState } from "react";
import OrderBySelection from "./OrderBySelection";
import LocationSelection from "./LocationSelection";
import RoomsSelection from "./RoomsSelection";
import DateSelection from "./DateSelection";
import AmenitySelection from "./AmenitySelection";

function SearchFilterForm({ query, setQuery, setProperties, setFormIsValid }) {

    const handleSubmit = (event) => {
        event.preventDefault();
        
        const order = event.target.order.value;
        const by = event.target.orderBy.value;
        const guests = event.target.guests.value;
        const bedrooms = event.target.bedrooms.value;
        const bathrooms = event.target.bathrooms.value;
        const city = event.target.city.value;
        const selectedAmenities = [];
        const available_from = event.target.checkInDate.value;
        const available_to = event.target.checkOutDate.value;
        const page = 1;

        // Get all selected amenities, and join to string with "/" char.
        for (let amenity of event.target.amenities) {
            if (amenity.checked) { selectedAmenities.push(amenity.value); }
        }
        const amenities = selectedAmenities.join("/");

        setProperties([]);
        setQuery({order: order, by: by, guests: guests, bedrooms: bedrooms,
            bathrooms: bathrooms, city: city, amenities: amenities,
            available_from: available_from, available_to: available_to,
            page: 1});
    }

    return <form id="search-filter-form" onSubmit={handleSubmit}>
        <OrderBySelection />
        <RoomsSelection />
        <LocationSelection />
        <DateSelection setFormIsValid={setFormIsValid} />
        <AmenitySelection />
    </form>;
}

export default SearchFilterForm;