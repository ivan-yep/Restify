import React from "react";

function LocationSelection() {
    return (<>
        <h4 className="mb-3 mt-4">Location</h4>
        <label htmlFor="city" className="form-label">City</label>
        <input className="form-control mb-2" type="text" placeholder="Enter a city" name="city" id="city" />
    </>);
}

export default LocationSelection;