import React from "react";
import { Link, useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PropertyForm from "../../components/CreateEditProperty/PropertyForm";

function EditProperty() {
    const { propertyID } = useParams();
    const [ form, setForm ] = useState(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        document.title = 'Restify • Edit Property'
    }, []);

    useEffect(() => {
        if (localStorage.getItem("token") === null) {
            navigate("/login")
        } else {
            fetch(`http://localhost:8000/property/${propertyID}/edit`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {   
                    setForm(<PropertyForm create_edit="edit" property={data} />);
                })
        }
    }, []);

    return (
        <div className="edit-property">
            <h2><Link to="/my-properties"><i className="fa-regular fa-circle-left"></i></Link> Edit Property</h2>
            {form}
        </div>
    )
}

export default EditProperty;
