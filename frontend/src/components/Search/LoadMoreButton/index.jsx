import React from "react";

export default function LoadMoreButton({ query, setQuery }) {
    const handleClick = () => {
        setQuery({...query, page: query.page + 1})
    }

    return <div className="container-fluid d-flex justify-content-center mb-5">
        <button onClick={handleClick} className="btn btn-primary">
            Load More
        </button>
    </div>;
}