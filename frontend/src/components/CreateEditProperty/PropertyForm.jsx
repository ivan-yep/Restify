import React from "react";
import * as Yup from "yup";

import { useEffect, useRef, useState } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { Card, Button, CardGroup } from "react-bootstrap";

import PropertyNumberDropdown from "./PropertyNumberDropdown";
import AmenitiesCheckboxGroup from "./AmenitiesCheckboxGroup"
import PropertyModal from "./PropertyModal";

import "./style.css"

// Define validation for form inputs using Yup
const createPropertySchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    country: Yup.string().required("Country is required"),
    price: Yup.number().positive("Price must be a positive value").required("Price is required"),
    description: Yup.string().required("Description is required"),
    num_bedrooms: Yup.number().required().oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    num_bathrooms: Yup.number().required().oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    num_guests: Yup.number().required().oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
});

// Set initial values for the form (blank if create, property values if edit)
const setInitialValues = (property) => {
    if (property === null) {
        return (
            {
                name: "",
                address: "",
                city: "",
                country: "",
                price: "",
                description: "",
                num_bedrooms: 1,
                num_bathrooms: 1,
                num_guests: 1,
                amenity: [],
            }
        );
    } else {
        let amenities = []

        if (property.amenities) {
            for (let i = 0; i < property.amenities.length; i++) {
                amenities.push(property.amenities[i].amenity);
            }
        }

        return (
            {
                name: property.name,
                address: property.address,
                city: property.city,
                country: property.country,
                price: property.price,
                description: property.description,
                num_bedrooms: property.num_bedrooms,
                num_bathrooms: property.num_bathrooms,
                num_guests: property.num_guests,
                amenity: amenities,
            }
        );
    }
}

// Send request to either create or edit the property
const sendRquest = (form_data, openModal, closeModal, url, method, navigate, editSuccess) => {
    fetch(url, {
        method: method,
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: form_data,
    })
        .then((response) => response.json())
        .then((data) => {
            if (method !== "DELETE") {
                if(method === "PATCH") {
                    editSuccess(data.images)
                }
                openModal()
            } else {
                closeModal()
                navigate("/my-properties")
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

function PropertyForm(props) {
    const navigate = useNavigate()
    const { create_edit, property } = props;

    var oldImagesInitial = []
    if (create_edit !== "create") {
        oldImagesInitial = property.images
    }

    // Initialize a state for each of the input fields 
    const imageRef = useRef(null);
    const [oldImages, setOldImages] = useState(oldImagesInitial);
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [images, setImages] = useState([]);
    const [validNumImages, setValidNumImages] = useState(true);
    const [imagesError, setImagesError] = useState(null);
    const [token, setToken] = useState(null)
    
    useEffect(() => {
        if (localStorage.getItem("token") === null) {
            navigate("/login")
        }
        setToken(localStorage.getItem("token"))
    }, []);

    useEffect(() => {
        if (validNumImages === false) {
            setImagesError(<p className="error">Please enter at least three images</p>);
        }
    }, [validNumImages]);

    const validateImages = () => {
        if(create_edit === "create" && images.length < 3) {
            setValidNumImages(false);
        }
        else if (create_edit === "edit" && images.length + oldImages.length < 3) {
            setValidNumImages(false);
        } 
        else {
            setValidNumImages(true);
            setImagesError(null);
        }
    }

    const onEditSuccess = (updatedImages) => {
        setOldImages(updatedImages)
    }

    const removeImage = (id) => {
        setOldImages((oldState) => oldState.filter((item) => item.id !== id));
    };

    const openSuccessModal = () => {
        setSuccessModalVisible(true);
    }

    const closeSuccessModal = () => {
        setSuccessModalVisible(false);
    }

    const openDeleteModal = () => {
        closeSuccessModal()
        setDeleteModalVisible(true);
    }

    const closeDeleteModal = () => {
        setDeleteModalVisible(false);
    }

    const initialValues = setInitialValues(property);
    const buttonValue = (create_edit === "create") ? "Create Property" : "Edit Property";
    const modalMessage = (create_edit === "create") ? "Your property has been created" : "Your changes have been saved";
    const additionalButtons = (create_edit === "create") ? null : (
        <>
            <Link to={`/property-details/${property.id}`}>
                <button className="btn btn-primary">See User View</button>
            </Link>
            <button className="btn btn-primary" onClick={openDeleteModal}>Delete Property</button>
        </>
    );

    const deletePropertyRequest = () => {
        sendRquest(null, null, closeDeleteModal, `http://localhost:8000/property/${property.id}/delete`, "DELETE", navigate, null);
    }

    const createPropertyRequest = (values, resetForm) => {
        if (validNumImages === true) {
            var form_data = new FormData();
            form_data.append('name', values.name);
            form_data.append('address', values.address);
            form_data.append('city', values.city);
            form_data.append('country', values.country);
            form_data.append('price', values.price);
            form_data.append('num_bedrooms', values.num_bedrooms);
            form_data.append('num_bathrooms', values.num_bathrooms);
            form_data.append('num_guests', values.num_guests);
            form_data.append('description', values.description);
            
            for (let i = 0; i < images.length; i++) {
                form_data.append(`images[${i}]image`, images[i]);
            }

            for (let i = images.length; i < images.length + oldImages.length; i++) {
                form_data.append(`images[${i}]id`, oldImages[i - images.length].id);
            }

            for (let i = 0; i < values.amenity.length; i++) {
                form_data.append(`amenities[${i}]amenity`, values.amenity[i]);
            }

            imageRef.current.value = null;
            if (create_edit === "create") {
                resetForm({ values: '' });
                sendRquest(form_data, openSuccessModal, null, "http://localhost:8000/property/create", "POST", null, null);
            } else {
                sendRquest(form_data, openSuccessModal, null, `http://localhost:8000/property/${property.id}/edit`, "PATCH", null, onEditSuccess);
            }
        }
    }

    return (
        <div className="property-form">
            <div className="additional-buttons">
                {additionalButtons}
            </div>

            <Formik initialValues={initialValues} validationSchema={createPropertySchema} validateOnChange={false} validateOnBlur={false} onSubmit={(values, { resetForm }) => { createPropertyRequest(values, resetForm) }}>
                {() => {
                    return (
                        <Form noValidate>
                            
                            {create_edit === "edit" &&
                            <div className="mb-3">
                                <label className="form-label">Current Images</label>
                                <div class="current-images">
                                    {oldImages.map((pic) => {
                                        return (
                                            <Card>
                                                <Card.Img width="200px" height="200px" variant="top" className="rounded" src={pic.image} />
                                                <Card.Body>
                                                    <Button variant="primary" className="btn btn-primary btn-sm" onClick={() => removeImage(pic.id)}>Delete</Button>
                                                </Card.Body>
                                            </Card>)
                                    })}
                                </div>
                            </div>}

                            <div className="mb-3">
                                <label className="form-label">{(create_edit === "create") ? <>Upload Images</> : <>Upload New Images</>}</label>
                                <input ref={imageRef} name="images" type="file" className="form-control" multiple onChange={(event) => setImages(event.target.files)} />
                                {imagesError}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <Field type="text" className="form-control" name="name" />
                                <ErrorMessage name="name" component="span" className="error" />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Address</label>
                                <Field type="text" className="form-control" name="address" />
                                <ErrorMessage name="address" component="span" className="error" />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">City</label>
                                <Field type="text" className="form-control" name="city" />
                                <ErrorMessage name="city" component="span" className="error" />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Country</label>
                                <Field type="text" className="form-control" name="country" />
                                <ErrorMessage name="country" component="span" className="error" />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Price</label>
                                <div className="input-group mb-3" id="price-input">
                                    <span className="input-group-text">$</span>
                                    <Field type="number" className="form-control" name="price" />
                                    <span className="input-group-text">.00</span>
                                </div>
                                <ErrorMessage name="price" component="span" className="error" />
                            </div>

                            <PropertyNumberDropdown label_text="Number of Bedrooms" select_name="num_bedrooms" icon_name="fa-solid fa-bed" />
                            <PropertyNumberDropdown label_text="Number of Bathrooms" select_name="num_bathrooms" icon_name="fa-solid fa-bath" />
                            <PropertyNumberDropdown label_text="Number of Guests" select_name="num_guests" icon_name="fa-solid fa-user-group" />

                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <Field className="form-control" rows="3" name="description" as="textarea" />
                                <ErrorMessage name="description" component="span" className="error" />
                            </div>

                            <AmenitiesCheckboxGroup />

                            <button type="submit" className="btn btn-primary" onClick={validateImages}>{buttonValue}</button>

                        </Form>
                    );
                }}
            </Formik>

            <PropertyModal show={successModalVisible} hide={closeSuccessModal} click={closeSuccessModal} title="Success!" message={modalMessage} button="Ok" />
            <PropertyModal show={deleteModalVisible} hide={closeDeleteModal} click={deletePropertyRequest} title="Warning!" message="This change is irreversible. You will be redirected to your properties on deletion" button="Confirm" />
        </div>
    )
}

export default PropertyForm;