import React from "react";

export default function LoadMoreCommentsButton({ currentPage, setCurrentPage }) {
    const handleClick = () => {
        setCurrentPage(currentPage + 1);
    }

    return <button onClick={handleClick} className="btn btn-secondary mt-3">
        Load more
    </button>;
}