import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function PropertyCard({ propertyID, name, location, avgRating, thumbnailSource, nightlyRate }) {
    const [firstDateAvailable, setFirstDateAvailable] = useState("");
    const [link, setLink] = useState("");

    useEffect(() => {
        getFirstDateAvailable(propertyID, setFirstDateAvailable);
        determineLink(propertyID, setLink);
    }, []);

    return (
    <div className="card col-12 col-sm-6 col-md-4 col-xxl-3 bg-transparent mb-4 px-2 border-0">
        <img className="card-img-top img-fluid rounded" src={thumbnailSource} alt="thumbnail" />
        <Link to={link} className="stretched-link"></Link>
        <div className="cardbody py-1">
            <div className="d-flex justify-content-between">
                <h5 className="card-title mb-0">{name}</h5>
                <h5 className="card-title mb-0">
                    {avgRating === 0 ? (
                        "No rating"
                    ) : (
                        `${Math.round((avgRating + Number.EPSILON) * 100) / 100} stars`
                    )}
                </h5>
            </div>
            <p className="card-text my-0">{location}</p>
            <p className="card-text fst-italic my-0">Available {firstDateAvailable}</p>
            <h5>${nightlyRate} night</h5>
        </div>

    </div>);
}

async function getFirstDateAvailable(propertyID, setFirstDateAvailable) {
    const fetchPropertyResponse = await fetch(`http://localhost:8000/home/${propertyID}`);
    const fetchedProperty = await fetchPropertyResponse.json();
    const currentReservations = fetchedProperty.reservations.filter(inProgress);
    currentReservations.sort(compareStartDate);
    const reservedDateIntervals = currentReservations.map(getDateInterval);
    
    // Look for 2 consecutive days available.
    const currentDate = new Date();
    if (reservedDateIntervals.length === 0
            || (reservedDateIntervals[0].start > currentDate
                 && daysBetween(reservedDateIntervals[0].start, currentDate) >= 2)) {
        setFirstDateAvailable(weekMonthDayYearFormat(currentDate));
        return;
    }

    for (let i = 0; i < reservedDateIntervals.length - 1; i++) {
        if (daysBetween(reservedDateIntervals[i].end, reservedDateIntervals[i + 1].start) >= 3) {
            setFirstDateAvailable(weekMonthDayYearFormat(addOneDay(reservedDateIntervals[i].end)));
            return;
        }
    }

    setFirstDateAvailable(weekMonthDayYearFormat(addOneDay(reservedDateIntervals[reservedDateIntervals.length - 1].end)));
    return;
   
   
    // for (let interval of reservedDateIntervals) {
    //     console.log(interval.start, interval.end);
    //     console.log(daysBetween(interval.start, interval.end));
    // }
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
    // startDate1 > startDate2
    return 1;
}

function getDateInterval(reservation) {
    return {start: getDateObject(reservation.start_date),
            end: getDateObject(reservation.end_date)};
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

function daysBetween(dateObject1, dateObject2) {
    const subCalculation = Math.abs(dateObject1 - dateObject2) / 1000;
    return Math.floor(subCalculation / 86400);
}

function addOneDay(dateObject) {
    dateObject.setDate(dateObject.getDate() + 1);
    return dateObject;
}

function weekMonthDayYearFormat(dateString) {
    const dateObject = new Date(Date.parse(dateString));
    return dateObject.toDateString();
}

async function determineLink(propertyID, setLink) {
    const username = localStorage.getItem("username");

    const response = await fetch(`http://localhost:8000/home/${propertyID}`);
    const propertyData = await response.json();

    const ownerUsername = propertyData.owner.username;
    
    setLink(username === ownerUsername ? (
        `/my-properties/edit/${propertyID}`
    ) : (
        `/property-details/${propertyID}`
    ));
    // console.log(username, ownerUsername, username === ownerUsername)
}