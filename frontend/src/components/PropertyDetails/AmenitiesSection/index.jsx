import React from "react";
import AmenitiesModal from "../Modals/AmenitiesModal";

export default function AmenitiesSection({ amenities }) {
    // amenities = [{amenity: "asdfa"}, {amenity: "asdfb"}, {amenity: "asdfc"}, 
    // {amenity: "asdf1"}, {amenity: "as2df"}, {amenity: "asd3f"}, 
    // {amenity: "asd4f"}, {amenity: "as5df"}, {amenity: "asdf6"}];

    if (amenities === null || amenities === undefined) {
        return null;
    }
    return <div className="container d-flex flex-column border-top border-secondary py-4">
        <h4>Amenities</h4>

        <div className="d-flex flex-row flex-wrap">
            {amenities.slice(0, 6).map(amenity => (
                <li key={amenity.amenity}
                className="list-group-item border-0 bg-transparent col-6 my-2">
                    {amenity.amenity}
                </li>
            ))}
        </div>

        {amenities.length > 6
        ?   <>
            <button className="flex-fill btn btn-primary" type="button"
            data-bs-toggle="modal" data-bs-target="#amenities">
                See all amenities
            </button>
            <AmenitiesModal amenities={amenities} />
            </>
        : null}
    </div>;
}

// {amenities.map(amenity => (
//     <li key={amenity.amenity}
//     className="list-group-item border-0 bg-transparent">
//         {amenity.amenity}
//     </li>
// ))}