import React from "react";

export default function GalleryCarousel({ images }) {
    return <div id="gallery-carousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-indicators">
            {images.map((_image, index) => (
                <button key={index} type="button" data-bs-target="#gallery-carousel" data-bs-slide-to={index} className={index === 0 ? "active" : ""}></button>
            ))}
        </div>
    
        <div className="carousel-inner">
            {images.map((image, index) => (
                <div key={index} className={"carousel-item" + (index === 0 ? " active" : "")}>
                    <img src={image.image} alt="image" className="d-block w-100" />
                </div>
            ))}
        </div>
    
        <button className="carousel-control-prev" type="button" data-bs-target="#gallery-carousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#gallery-carousel" data-bs-slide="next">
            <span className="carousel-control-next-icon"></span>
        </button>
  </div>;
}