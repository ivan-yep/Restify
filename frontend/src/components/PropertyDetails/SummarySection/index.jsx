import React from "react";

export default function SummarySection({ property }) {
    const {city, country, num_guests, num_bedrooms, num_bathrooms, owner} = property;
    const {first_name, photo} = copy(owner);

    return <div className="container d-flex justify-content-between border-top border-secondary py-4">
        <div className="d-flex flex-column">
            <h4>Property in {city}, {country}, hosted by {first_name}</h4>
            <h6>{num_guests} guests | {num_bedrooms} bedrooms | {num_bathrooms} bathrooms</h6>
        </div>
        <button data-bs-toggle="modal" data-bs-target="#contact" 
        className="btn border-0 bg-transparent m-0 p-0 col-3" role="button">
        <img src={photo} alt="host" className="rounded-circle border img-fluid w-75" />
        </button>
    </div>;
}

function copy(objectToCopy) {
    const newCopy = {};
    for (let key in objectToCopy) {
        newCopy[key] = objectToCopy[key];
    }
    return newCopy;
}