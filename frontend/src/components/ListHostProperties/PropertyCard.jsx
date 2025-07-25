import React from "react";
import { Link } from "react-router-dom";

function PropertyCard(props) {
    const { id, images, name, description, beds, baths, guests} = props;

    var property_carousel_id = "property-card-image-carousel-".concat(id)
    var property_carousel_target = "#".concat(property_carousel_id)
    var images_carousel = []
    
    for (let i = 0; i < images.length; i++) {
        var image_domain = 'http://127.0.0.1:8000'
        var image_file = images[i].image.substring(image_domain.length)
        var image_source = image_domain.concat(image_file);

        var class_name = "carousel-item"
        if (i === 0) {
            class_name = "carousel-item active"
        }
        
        var current_image = 
        (<div className={class_name} key={"image".concat(i).concat(id)}>
            <img key={images[i].id} src={image_source} className="d-block w-100" alt="..." />
        </div>)
        images_carousel.push(current_image)
    }

    return (
        <div className="card" id={id}>
            {/*  Carousel of home images at the top */}
            <div id={property_carousel_id} className="carousel slide">
                <div className="carousel-inner">
                    {images_carousel}
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target={property_carousel_target}
                    data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target={property_carousel_target}
                    data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>

            {/* Description of the property */}
            <div className="card-body">
                {/* Title */}
                <h5 className="card-title">{name}</h5>

                {/* Number of bed, bath, guests*/}
                <div className="property-card-bed-bath-guest-grid">
                    <div className="property-card-bed-bath-guest-grid-bed">
                        <p><i className="fa-solid fa-bed"></i> {beds}</p>
                    </div>
                    <div className="property-card-bed-bath-guest-grid-bath">
                        <p><i className="fa-solid fa-bath"></i> {baths}</p>
                    </div>
                    <div className="property-card-bed-bath-guest-grid-guest">
                        <p><i className="fa-solid fa-user-group"></i> {guests}</p>
                    </div>
                </div>

                {/* Property description */}
                <p className="card-text">{description.length > 90 ? description.substring(0, 90).concat("...") : description}</p>

                <div className="card-button-row">
                    <Link to={`/my-properties/edit/${id}`}>
                        <button className="btn btn-primary">Edit</button>
                    </Link>   
                    <Link to={`/my-properties/reservations/${id}/${name}`}>
                        <button className="btn btn-primary">View Reservations</button>
                    </Link>
                    <Link to={`/property-details/${id}`}>
                        <button className="btn btn-primary comments-btn">View Comments</button>
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default PropertyCard;