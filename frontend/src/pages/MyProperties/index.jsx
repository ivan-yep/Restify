import React from "react";
import {useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import PropertyCard from "../../components/ListHostProperties/PropertyCard";
import '../../components/ListHostProperties/style.css';

function ListProperties() {
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);
    
    const navigateToCreate = () => {
        // navigate to create-property
        navigate('/my-properties/create-property');
    };

    useEffect(() => {
        document.title = 'Restify • My Properties'
    }, []);

    useEffect(() => {
        if (localStorage.getItem("token") === null) {
            navigate("/login")
        } else {
            fetch("http://localhost:8000/property/list", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    var property_cards = []
                    for (let i = 0; i < data.length; i++) {
                        property_cards.push(<PropertyCard key={data[i].id} id={data[i].id} images={data[i].images} name={data[i].name} description={data[i].description} beds={data[i].num_bedrooms} baths={data[i].num_bathrooms} guests={data[i].num_guests} />)
                    }
    
                    var empty_card = (
                        <div className="card create-card">
                            <button key="empty-card" onClick={navigateToCreate} className="btn btn-primary">Add Property</button>
                        </div>
                    );
                    property_cards.push(empty_card)
                    setProperties(property_cards);
                })
        }

    }, []);

    return (
        <div className="my-properties">
            <h2>My Properties</h2>
            <div className="rental-properties">
                {properties}
            </div>
        </ div>
    );
}

export default ListProperties;