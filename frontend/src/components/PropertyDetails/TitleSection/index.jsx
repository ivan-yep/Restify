import React from "react";
import GalleryModal from "../Modals/GalleryModal";

export default function TitleSection({ propertyName, images }) {
    if (propertyName === null || propertyName === undefined
            ||images === null || images === undefined) {
        return null;
    }

    const titleImages = [
        (images.length >= 1
        ? <img key="0" className="img-fluid col-md-7 px-0" src={images[0].image} alt="sample" id="left-img" />
        : null),
        (images.length >= 2
        ? <img key="1" className="img-fluid d-none col-md-5 d-md-inline-block px-0" src={images[1].image} alt="sample" id="right-img" />
        : null)
    ];
    
    return <div className="container d-flex flex-column" id="title-block">
        <button type="button" data-bs-toggle="modal" data-bs-target="#images" className="border-0 bg-transparent p-0">
            <div className="row mb-2" id="main-images">
                {titleImages}
            </div>
        </button>
        <h2 className="mb-3 mt-1 mx-0 px-0">{propertyName}</h2>

        <GalleryModal images={images} />
    </div>;
}