import React from "react";

function RoomsSelection() {
    const fields = ["guests", "bedrooms", "bathrooms"];
    return (<>

    <h4 className="mb-3">Rooms</h4>

    {fields.map(field => (<FieldSelection key={field} field={field} />))}

    </>);
}

function FieldSelection({ field }) {
    const label = field.charAt(0).toUpperCase() + field.slice(1);
    const placeholder = `Number of ${field}`;
    
    return (<>
    <label htmlFor={field} className="form-label">{label}</label>
    <input className="form-control mb-2" type="number" min="0" placeholder={placeholder} name={field} id={field} />
    </>);
}

export default RoomsSelection;