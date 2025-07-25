import React, {useEffect} from "react";
import PropertyForm from "../../components/CreateEditProperty/PropertyForm";
import { Link } from "react-router-dom";

function CreateProperty() {
    useEffect(() => {
        document.title = 'Restify • Create Property'
    }, []);

    return (
        <div className="create-property">
            <h2><Link to="/my-properties"><i className="fa-regular fa-circle-left"></i></Link> Create Property</h2>
            <PropertyForm create_edit="create" property={null}/>
        </div>
    )
}

export default CreateProperty;