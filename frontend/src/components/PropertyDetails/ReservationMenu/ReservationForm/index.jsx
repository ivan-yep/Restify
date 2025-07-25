import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Navigate, useNavigate } from "react-router-dom";


export default function ReservationForm({ formID, maxGuests, reservations,
                                          propertyID }) {
    const [dateRange, setDateRange] = useState([null, null]);
    const [checkInDate, checkOutDate] = dateRange;
    const redirect = useNavigate()
    
    const currentReservations = reservations.filter(inProgress);
    currentReservations.sort(compareStartDate);
    const reservedDateIntervals = currentReservations.map(getDateInterval);

    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    useEffect(() => {
        setSuccessMsg("");
    }, [errorMsg]);
    useEffect(() => {
        setErrorMsg("");
    }, [successMsg]);

    const handleSubmit = (event) => {
        event.preventDefault();
        
        const token = localStorage.getItem("token");
        if (token === null) {
            document.getElementById("close-small-screen-reservation-modal").click();
            return redirect("/login");
        }
        if (checkInDate === null || checkOutDate === null
                || datesEqual(checkInDate, checkOutDate)) {
            setErrorMsg("Please select at least 2 dates.");
            return;
        }
        if (intervalOverlaps(checkInDate, checkOutDate, reservedDateIntervals)) {
            setErrorMsg("You selected invalid dates.");
            return;
        }
        setErrorMsg("");

        var succeeded = createReservation(getDateStr(checkInDate, 0),
                          getDateStr(checkOutDate, 0), propertyID, token);

        if (succeeded) {
            console.log("AUGHHH SUCCESS");
            setSuccessMsg("Successfully made a reservation. Thanks!");
            document.getElementById("close-small-screen-reservation-modal").click();
            return redirect("/my-reservations");
        } else {
            console.log("AUGHHHH NOT TRY");
            setErrorMsg("Failed to reserve.");
        }
    }

    return <form id={formID} onSubmit={handleSubmit}>

        <label htmlFor="num-guests" className="form-label">Guests</label>
        <input required className="form-control mb-3" type="number" min="1"
        defaultValue="1" max={maxGuests} name="num-guests" id="num-guests" />

        <label htmlFor="checkInCheckOut" className="form-label">
            Check-in & Check-out
        </label>
        <DatePicker
            id="checkInCheckOut"
            name="checkInCheckOut"
            selectsRange={true}
            startDate={checkInDate}
            endDate={checkOutDate}
            onChange={newDateRange => setDateRange(newDateRange)}
            isClearable={true}
            dateFormat="yyyy-MM-dd"
            minDate={getDateObject(getCurrentDateStr(0))}
            excludeDateIntervals={reservedDateIntervals}
            placeholderText="Select dates"
            className="form-control"
        />
        <div className="text-danger">{errorMsg}</div>
        <div className="text-success">{successMsg}</div>
    </form>;

}

function inProgress(reservation) {
    const inProgressStatues = ["A", "CD", "CP"];
    return inProgressStatues.includes(reservation.status);
}

function compareStartDate(reservation1, reservation2) {
    const startDate1 = getDateObject(reservation1.start_date);
    const startDate2 = getDateObject(reservation2.start_date);

    if (startDate1 < startDate2) {
        return -1;
    } else if (startDate1 === startDate2) {
        return 0;
    }
    // startDate1 > startDate 2
    return 1;
}

function getDateInterval(reservation) {
    return {start: getDateObject(reservation.start_date),
            end: getDateObject(reservation.end_date)};
}

function datesEqual(dateObject1, dateObject2) {
    return dateObject1 <= dateObject2 && dateObject1 >= dateObject2;
}

function intervalOverlaps(propsedStart, proposedEnd, existingIntervals) {
    for (let interval of existingIntervals) {
        let start = interval.start;
        let end = interval.end;
        
        if (proposedEnd >= start && propsedStart <= end) {
            return true;
        }
    }
    return false;
}

function getCurrentDateStr(offsetDays) {
    const currentDate = new Date();
    return getDateStr(currentDate, offsetDays);
}

function getDateStr(date, offsetDays) {
    date.setDate(date.getDate() + offsetDays);
    var currentDay = String(date.getDate()).padStart(2, '0');
    var currentMonth = String(date.getMonth() + 1).padStart(2, "0");
    var currentYear = date.getFullYear();
    return `${currentYear}-${currentMonth}-${currentDay}`;
}

function getDateObject(dateString) {
    const [year, month, day] = dateString.split('-');
    return new Date(year, parseInt(month) - 1, day);
}

async function createReservation(checkInDate, checkOutDate, propertyID,
                                 authToken) {
    const response = await fetch(
        `http://localhost:8000/reservation/${propertyID}/create`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`,
            },
            body: JSON.stringify({
                "start_date": checkInDate,
                "end_date": checkOutDate})
        });
    return response.ok;
}