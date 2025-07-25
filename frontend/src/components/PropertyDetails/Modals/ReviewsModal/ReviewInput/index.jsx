import React, { useEffect, useState } from "react";

export default function ReviewInput({ propertyID, setSuccessMessage, setErrorMessage}) {
    const [unreviewedReservations, setUnreviewedReservations] = useState([]);

    useEffect(() => {
        getUnreviewedReservations(propertyID, setUnreviewedReservations);
    }, []);

    // useEffect(() => {
    //     console.log(unreviewedReservations);
    // }, [unreviewedReservations]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setSuccessMessage("");
        setErrorMessage("");
        
        const reservation = event.target.reservation.value;
        const comment = event.target.comment.value;
        const rating = event.target.rating.value;
        const authToken = localStorage.getItem("token");

        const formData = {"reservation": Number(reservation), "comment": comment};
        if (rating !== "") { formData["rating"] = Number(rating); }

        const response = await fetch(
            "http://localhost:8000/comments/property/write",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`
                },
                body: JSON.stringify(formData)
            });
        if (response.ok) {
            getUnreviewedReservations(propertyID, setUnreviewedReservations);
            setSuccessMessage("Review submitted");
            setErrorMessage("");
        } else {
            setErrorMessage("Submission failed");
            setSuccessMessage("");
        }
    }

    if (unreviewedReservations.length === 0) {
        return <h4 className="mb-4">
            You have no unreviewed reservations at this property.
        </h4>
    }

    return <form onSubmit={handleSubmit} className="mb-2 d-flex-flex-column">

        <label htmlFor="reservation" className="form-label">Reservation</label>
        <select id="reservation" name="reservation" className="form-select form-select-lg" required>
            {unreviewedReservations.map((reservation, index) => (
                <option value={reservation.id} key={reservation.id} className={index % 2 === 0 ? "bg-light" : ""}>
                    {`${reservation.id}) `} {monthDayYearFormat(reservation.start_date)} - {monthDayYearFormat(reservation.end_date)}
                </option>
            ))}
        </select>

        <label htmlFor="comment" className="form-label mt-3">Comment</label>
        <textarea id="comment" name="comment" className="form-control" rows="5"
        placeholder="Leave a comment" required></textarea>

        <div className="d-flex flex-column mt-3">
            <label htmlFor="rating" className="form-label">Rating</label>
            <input className="form-control w-25" type="number" name="rating"
            id="rating" placeholder="Rating" min="1" max="5" step="1" />
            <button type="submit" className="btn btn-primary border mt-3">Submit review</button>
        </div>
    </form>;
}

async function getUnreviewedReservations(propertyID, setUnreviewedReservations) {
    const username = localStorage.getItem("username");
    const authToken = localStorage.getItem("token");

    const reservations = await getAllUserReservations(username, authToken);
    // console.log(reservations);
    const propertyReservations = reservations.filter(
        reservation => finishedForProperty(reservation, propertyID));
    // console.log(propertyReservations);
    const unreviewedReservations = await filterUnreviewed(propertyReservations);
    // console.log(unreviewedReservations);
    setUnreviewedReservations(unreviewedReservations);
}

async function getAllUserReservations(username, authToken) {
    const reservations = [];
    var response = null;
    var data = null;
    var fetchURL = `http://localhost:8000/reservation/${username}/list?user_type=guest`;

    do {
        response = await fetch(fetchURL, {
            method: "GET",
            headers: { Authorization: `Bearer ${authToken}` }
        });
        data = await response.json();
        reservations.push(...data.results);
        fetchURL = data.next;
    } while (fetchURL != null); 

    return reservations;
}

function finishedForProperty(reservation, propertyID) {
    // console.log(reservation.status, ["CO", "T"].includes(reservation.status));
    // console.log(reservation.property.id);
    return ["CO", "T"].includes(reservation.status)
        && reservation.property.id === Number(propertyID);
}

async function filterUnreviewed(reservations) {
    const filteredReservations = [];
    for (let reservation of reservations) {
        let response = await fetch(
            `http://localhost:8000/comments/property/reservation/${reservation.id}`);

        // Keep the reservations where the property comment is 404 not found.
        if (response.status === 404) {
            filteredReservations.push(reservation);
        }
    }
    return filteredReservations;
}

function monthDayYearFormat(dateString) {
    const dateObject = new Date(Date.parse(dateString));
    // Omit first 3 letters (weekday) + space.
    return dateObject.toDateString().slice(4);
}