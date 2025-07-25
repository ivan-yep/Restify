import React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MultiSelect } from "react-multi-select-component";

import ReservationCard from "../../components/Reservations/ReservationCard";

import "../../components/Reservations/style.css";

function convertCodeToString(code) {
    var reservation = { status: "", options: [], options_full: [] };

    switch (code) {
        case "P":
            reservation.status = "Pending";
            // Can approve or deny
            reservation.options = ["P", "A", "D"];
            reservation.options_full = ["Pending", "Approve", "Deny"];
            break;
        case "D":
            reservation.status = "Denied";
            // No other options, completed state 
            break;
        case "E":
            reservation.status = "Expired";
            // No other options, completed state
            break;
        case "A":
            reservation.status = "Approved";
            // Can terminate
            reservation.options = ["A", "T"];
            reservation.options_full = ["Approved", "Terminate"]
            break;
        case "T":
            reservation.status = "Terminated";
            // No other options, completed state
            break;
        case "CA":
            reservation.status = "Cancellation Approved";
            // No other options, completed state
            break;
        case "CD":
            reservation.status = "Cancellation Denied";
            // Can terminate 
            reservation.options = ["CD", "T"];
            reservation.options_full = ["Cancellation Denied", "Terminate"];
            break;
        case "CP":
            reservation.status = "Cancellation Pending";
            // Can approve or deny the cancellation
            reservation.options = ["CP", "CA", "CD"];
            reservation.options_full = ["Cancellation Pending", "Approve Cancellation", "Deny Cancellation"]
            break;
        case "CO":
            reservation.status = "Completed";
            // No other options, completed state
            break;
        default:
            reservation.status = "Pending";
    }
    return reservation
}

const dropdownDisplayStates = ["P", "A", "CD", "CP"];

const StateOptions = [
    { label: "Pending", value: "P" },
    { label: "Denied", value: "D" },
    { label: "Expired", value: "E" },
    { label: "Approved", value: "A" },
    { label: "Terminated", value: "T" },
    { label: "Cancelled Approved", value: "CA" },
    { label: "Cancelled Denied", value: "CD" },
    { label: "Cancelled Pending", value: "CP" },
    { label: "Completed", value: "CO" },
];

function PropertyReservation() {
    // Set document page title 
    useEffect(() => {
        document.title = 'Restify • Property Reservations'
    }, []);

    const { propertyID, name } = useParams();
    const [reservations, setReservations] = useState([]);
    const [page, setPage] = useState(1);
    const [nextPage, setNextPage] = useState(false)
    const [selected, setSelected] = useState(StateOptions);
    const [stateParam, setStateParam] = useState("P/D/E/A/T/CA/CD/CP/CO/");
    const [statusUpdated, setStatusUpdate] = useState(false)
    const navigate = useNavigate()

    // Reset state parameters on filter change
    useEffect(() => {
        let stateCodes = ""
        for (let i = 0; i < selected.length; i++) {
            stateCodes = stateCodes.concat(selected[i].value, "/")
        }

        setReservations([])
        setStateParam(stateCodes)
        setPage(1)
    }, [selected]);

    // Set reservation cards
    useEffect(() => {
        if (localStorage.getItem("token") === null) {
            navigate("/login")
        } else {
            fetch(`http://localhost:8000/reservation/property/${propertyID}?page=${page}&status=${stateParam}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    // Create a reservation card for each reservation
                    var reservation_cards = [];
                    for (let i = 0; i < data.results.length; i++) {
                        reservation_cards.push(
                            <ReservationCard 
                            key={data.results[i].id}
                            initial_reservation={data.results[i]} 
                            states={stateParam} 
                            codeToString={convertCodeToString}
                            displayStates={dropdownDisplayStates}
                            reservation_type="host"/>);
                    }

                    if (data.next === null) {
                        setNextPage(false)
                    } else {
                        setNextPage(true)
                    }

                    setReservations(reservations.concat(reservation_cards));
                    setStatusUpdate(false)
                })
        }
    }, [page, stateParam, statusUpdated]);

    return (
        <div className="property-reservations">
            <h2>
                <Link to="/my-properties">
                    <i className="fa-regular fa-circle-left"></i>
                </Link> Reservations for {name}
            </h2>

            <div className="options-dropdown">
                <h5>Reservation Status</h5>
                <MultiSelect
                    options={StateOptions}
                    value={selected}
                    onChange={setSelected}
                    labelledBy="Select"/>
            </div>


            <div className="all-reservations">
                {reservations}
            </div>

            <div className="load-more">
                {
                    nextPage === true && 
                    <button className="btn btn-primary" onClick={() => { setPage(page + 1) }}>
                        Load More
                    </button>
                }
            </div>
        </div>
    );
}

export default PropertyReservation;