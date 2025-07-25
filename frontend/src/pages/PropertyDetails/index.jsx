import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TitleSection from "../../components/PropertyDetails/TitleSection";
import SummarySection from "../../components/PropertyDetails/SummarySection";
import DescriptionSection from "../../components/PropertyDetails/DescriptionSection";
import AmenitiesSection from "../../components/PropertyDetails/AmenitiesSection";
import ReviewsSection from "../../components/PropertyDetails/ReviewsSection";
import ContactSection from "../../components/PropertyDetails/ContactSection";
import BigScreenReservationSection from "../../components/PropertyDetails/ReservationMenu/BigScreenReservationSection";
import SmallScreenReservationSection from "../../components/PropertyDetails/ReservationMenu/SmallScreenReservationSection";
import "./style.css";

export default function PropertyDetails() {
    const { propertyID } = useParams();
    const [property, setProperty] = useState({});
    useEffect(() => {
        getProperty(setProperty, propertyID);
    }, []);

    if (typeof(property) === "string") { return displayMessage(property); }

    return <main className="property-details-page">
        <TitleSection propertyName={property.name} images={property.images} />
        <div className="d-flex flex-row container">
            <div>
                <SummarySection property={property} />
                <DescriptionSection description={property.description} />
                <AmenitiesSection amenities={property.amenities} />
                <ReviewsSection propertyID={propertyID} avgRating={property.average_rating} owner={property.owner} />
                <ContactSection owner={property.owner} />
            </div>
            <BigScreenReservationSection property={property} />
        </div>
        <SmallScreenReservationSection property={property} />
    </main>;
}

async function getProperty(setProperty, propertyID) {
    const response = await fetch(`http://localhost:8000/home/${propertyID}`);
    if (!response.ok) {
        setProperty(response.statusText);
        return;
    }
    const fetchedProperty = await response.json();
    setProperty(fetchedProperty);
}

function displayMessage(message) {
    return <div
            className="d-flex justify-content-center align-items-center">
        <h4 className="text-center text-wrap">{message}</h4>
    </div>;
}