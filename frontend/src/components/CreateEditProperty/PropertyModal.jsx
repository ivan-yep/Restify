import React from "react";
import { Modal, Button } from "react-bootstrap";

function PropertyModal(props) {
    const { show, hide, title, message, button, click } = props;

    if (title)
    return (
        <Modal show={show} onHide={hide}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{message}</Modal.Body>
            <Modal.Footer>
                <Button variant="btn btn-primary" onClick={click}>
                    {button}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default PropertyModal;