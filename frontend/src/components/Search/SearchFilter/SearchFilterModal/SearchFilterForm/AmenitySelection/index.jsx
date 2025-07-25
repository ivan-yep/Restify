import React from "react";

function AmenitySelection() {
    const amenities = ["Pool", "Wi-Fi", "Air Conditioning", "Heating",
        "Pets Allowed", "Washer and Dryer", "Jacuzzi",
        "Free Parking", "Equipped Kitchen", "Fireplace"];

    return <>
        <h4 className="mt-4">Amenities</h4>
        
        <div className="d-flex flex-wrap mt-4">

            {amenities.map(amenity => (
                <div key={amenity} className="form-check col-6 mb-4">
                    <label className="form-check-label">{amenity}
                    <input className="form-check-input" type="checkbox"
                        name="amenities" value={amenity} />
                    </label>
                </div>
            ))}

        </div>
    </>;
}

export default AmenitySelection;