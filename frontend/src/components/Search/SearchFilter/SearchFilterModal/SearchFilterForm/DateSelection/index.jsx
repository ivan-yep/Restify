import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DateSelection({ setFormIsValid }) {
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        // error check
        if (checkInDate !== null && checkOutDate != null) {
            if (checkOutDate < checkInDate) {
                setErrorMsg("Invalid dates.");
                setFormIsValid(false);
                return;
            }
            else if (datesEqual(checkInDate, checkOutDate)) {
                setErrorMsg("Please select 2 different dates.");
                setFormIsValid(false);
                return;
            }
        }
        setFormIsValid(true);
        setErrorMsg("");
    }, [checkInDate, checkOutDate]);

    return <>
        <h4 className="mt-4 mb-3">Dates</h4>

        <label htmlFor="checkInDate" className="form-label">Check-in</label>
        <DatePicker
            id="checkInDate"
            name="checkInDate"
            selectsStart
            selected={checkInDate}
            startDate={checkInDate}
            endDate={checkOutDate}
            onChange={newCheckInDate => setCheckInDate(newCheckInDate)}
            isClearable={true}
            dateFormat="yyyy-MM-dd"
            minDate={getDateObject(getCurrentDateStr(0))}
            placeholderText="Select date"
            className="form-control"
        />

        <label htmlFor="checkOutDate" className="form-label mt-2">Check-out</label>
        <DatePicker
            id="checkOutDate"
            name="checkOutDate"
            selectsEnd
            selected={checkOutDate}
            startDate={checkInDate}
            endDate={checkOutDate}
            onChange={newCheckOutDate => setCheckOutDate(newCheckOutDate)}
            isClearable={true}
            dateFormat="yyyy-MM-dd"
            minDate={getDateObject(getCurrentDateStr(1))}
            placeholderText="Select dates"
            className="form-control"
        />

        <div className="text-danger">{errorMsg}</div>
    </>;
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

function offsetByDays(dateObject, offset) {
    dateObject.setDate(dateObject.getDate() + offset);
    return dateObject;
}

function datesEqual(dateObject1, dateObject2) {
    return dateObject1 <= dateObject2 && dateObject1 >= dateObject2;
}

