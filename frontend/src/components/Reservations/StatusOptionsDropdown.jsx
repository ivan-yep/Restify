import React from "react";
import { useState } from "react";
import { Modal, Button } from "react-bootstrap";

function StatusOptionsDropdown(props) {
    const { converted_reservation, reservation, dropdown_toggle, update_reservation } = props;
    const [ reservationStatus, setReservationStatus ] = useState(`${converted_reservation.options[0]}`);
    const [ successModalVisible, setSuccessModalVisible ] = useState(false);

    let options_array = []
    let options_full = converted_reservation.options_full
    for (let i = 0; i < options_full.length; i++) {
        options_array.push(<option key={"reservation".concat(reservation.id).concat(i)} value={i}>{options_full[i]}</option>)
    }

    const onStatusChange = (event) => {
        const value = event.target.value;
        setReservationStatus(converted_reservation.options[value]);
    };

    const onConfirmButton = (event) => {
        event.preventDefault(); 

        var form_data = new FormData();
        form_data.append('status', reservationStatus);

        fetch(`http://localhost:8000/reservation/${reservation.id}/update`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            body: form_data,
        })
            .then((response) => response.json())
            .then(() => {
                setSuccessModalVisible(true)
            })
    }

    const onCloseModalButton = () => {
        setSuccessModalVisible(false)
        dropdown_toggle()
        update_reservation()
    }

    return (
        <>
            <div id="change-status">
                <div className="card card-body">
                    <div className="mb-3 item2">

                        <form onSubmit={(event) => {onConfirmButton(event)}}>
                            <label htmlFor="reservationStatus" className="form-label">Status</label>
                            <div className="input-group mb-3">
                                <label className="input-group-text" htmlFor="property-status"><i
                                    className="fa-solid fa-circle-check"></i></label>
                                <select className="form-select" id="property-status" name="reservation-status-update" onChange={onStatusChange} defaultValue={"0"} required>
                                    {options_array}
                                </select>
                            </div>

                            <div className="form-check" id="checkbox-confirm-reservation-update">
                                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" required/>
                                <label className="form-check-label" htmlFor="flexCheckDefault">
                                    I understand that these changes are irreversible
                                </label>
                            </div>

                            <button type="submit" className="btn btn-primary" ata-bs-toggle="modal" data-bs-target="#confirm-reservation-change">
                                Confirm
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <Modal show={successModalVisible} onHide={onCloseModalButton}>
                <Modal.Header closeButton>
                    <Modal.Title>Success!</Modal.Title>
                </Modal.Header>
                <Modal.Body>Your changes have been saved.</Modal.Body>
                <Modal.Footer>
                    <Button variant="btn btn-primary" onClick={onCloseModalButton}>
                        Ok
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default StatusOptionsDropdown;