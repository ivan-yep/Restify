import React from "react";
import { Field } from "formik";

function AmenitiesCheckboxGroup() {
    const amenity_list = [];
    const values = ["Pool", "Wi-Fi", "Air Conditioning", "Heating", "Pets Allowed", "Washer and Dryer", "Jacuzzi", "Free Parking", "Equipped Kitchen", "Fireplace"];
    for (let i = 0; i < values.length; i++) {
        var amenity_to_add =
            <div className="form-check" key={i}>
                <Field className="form-check-input" type="checkbox" value={values[i]} name="amenity" />
                <label className="form-check-label">
                    {values[i]}
                </label>
            </div>

        amenity_list.push(amenity_to_add)
    }

    return (
        <div className="mb-3">
            <label htmlFor="propertyAmenities" className="form-label">Amenities</label>
            <div className="amenities-list">
                <div className="amenities-list-col">
                    {amenity_list.slice(0, 5)}
                </div>
                <div className="amenities-list-col">
                    {amenity_list.slice(5, 10)}
                </div>
            </div>
        </div>
    );
}

export default AmenitiesCheckboxGroup;