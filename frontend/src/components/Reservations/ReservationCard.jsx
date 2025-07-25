import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StatusOptionsDropdown from "./StatusOptionsDropdown";

function convertDateToStringFormat(date) {
    const date_parts = date.split("-");
    var formatted_date = new Date(date_parts[0], date_parts[1], date_parts[2]);
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return (months[formatted_date.getMonth() - 1] + ' ' + formatted_date.getDate() + ', ' + formatted_date.getFullYear());
}

function ReservationCard(props) {
    const { initial_reservation, states, codeToString, displayStates, reservation_type } = props;
    const [reservationData, setReservationData] = useState(initial_reservation)
    const [reservation, setReservation] = useState(null)
    const [dropdownVisible, setDropdownVisible] = useState(false);

    // Toggle update status dropdown
    const toggleDropdown = () => {
        setDropdownVisible(dropdownVisible ? false : true);
    }

    // When the confirm reservation button is pressed, retrieve updated data and set it 
    const setReservationOnConfirm = () => {
        fetch(`http://localhost:8000/reservation/${reservationData.id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setReservationData(data);
            })
    }

    // Set reservation to be displayed 
    useEffect(() => {
        const convertedReservation = codeToString(reservationData.status);
        const displayButton = displayStates.includes(reservationData.status);

        if (states.includes(reservationData.status)) {
            setReservation(
                <div className="reservation-container">
                    <div className="reservation-profile">
                        <img className="reservation-profile-image" src={reservation_type === "host" ? reservationData.guest.photo : reservationData.property.owner.photo} alt="profile of guest" />
                    </div>
                    <div className="status">
                        <p className="heading">Status</p>
                    </div>
                    <div className="status-value">
                        <p>{convertedReservation.status}</p>
                    </div>

                    <div className="guest">
                        <p className="heading">{reservation_type === "host" ? "Guest" : "Host"}</p>
                    </div>
                    <div className="guest-val">
                        <p>{reservation_type === "host" ? reservationData.guest.username : reservationData.property.owner.username}</p>
                    </div>

                    {
                        reservation_type === "host" ? null :
                            <>
                                <div className="property-name">
                                    <p className="heading">Property</p>
                                </div>
                                <div className="property-name-val">
                                    <p>{reservationData.property.name}</p>
                                </div>
                            </>
                    }

                    <div className="reservation-start-date">
                        <p className="heading">Reservation Start Date</p>
                    </div>
                    <div className="reservation-start-date-value">
                        <p>{convertDateToStringFormat(reservationData.start_date)}</p>
                    </div>
                    <div className="reservation-end-date">
                        <p className="heading">Reservation End Date</p>
                    </div>
                    <div className="reservation-end-date-value">
                        <p>{convertDateToStringFormat(reservationData.end_date)}</p>
                    </div>
                    <div className="price">
                        <p className="heading">Price</p>
                    </div>
                    <div className="price-value">
                        <p>${reservationData.price}</p>
                    </div>
                    <div className="res-btn">
                        {reservation_type === "host" ?
                            <Link to={`/profile/${reservationData.guest.username}/view`}>
                                <button className="btn btn-primary">View Profile</button>
                            </Link> :
                            <Link to={`/profile/${reservationData.property.owner.username}/view`}>
                                <button className="btn btn-primary">View Profile</button>
                            </Link>
                        }

                        {displayButton === true &&
                            <button className="btn btn-primary" onClick={toggleDropdown}>
                                Update Status
                            </button>}

                        {reservation_type === "host" ?
                            null :
                            <Link to={`/property-details/${reservationData.property.id}`}>
                                <button className="btn btn-primary">View Property</button>
                            </Link>
                        }
                    </div>

                    {dropdownVisible === true && displayButton === true &&
                        <StatusOptionsDropdown
                            converted_reservation={convertedReservation}
                            update_reservation={setReservationOnConfirm}
                            reservation={reservationData}
                            dropdown_toggle={toggleDropdown}
                            statusUpdate={props.statusUpdate} />}
                </div>
            )
        } else {
            setReservation(null)
        }
    }, [reservationData, dropdownVisible]);

    return (
        <>
            {reservation}
        </>
    );
}

export default ReservationCard;