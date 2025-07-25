import React from "react";

function SearchFilterOpenButton() {
    return (
    <div className="d-flex justify-content-center align-items-center bg-light py-3 bg-transparent">
        <button type="button" data-bs-toggle="modal" data-bs-target="#search" className="btn btn-primary rounded w-50">
            Filter and sort
        </button>
    </div>);
}

export default SearchFilterOpenButton;