import React, { useEffect, useState } from "react";
import ReviewCard from "../../ReviewsSection/ReviewCard";
import LoadMoreCommentsButton from "./LoadMoreCommentsButton";
import ReviewInput from "./ReviewInput";
import { useNavigate } from "react-router-dom";

export default function ReviewsModal({ propertyID, numReviews, avgRating, owner }) {
    const [comments, setComments] = useState([]);
    const [thereAreMoreResults, setThereAreMoreResults] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();
    const redirectToLogin = () => {
        return navigate("/login");
    }

    useEffect(() => {
        appendNextPage(propertyID, comments, setComments, currentPage,
                       setThereAreMoreResults);
    }, [currentPage]);

    return <div className="modal fade" id="reviews">
    <div className="modal-dialog modal-dialog-scrollable modal-fullscreen-sm-down modal-md">
    <div className="modal-content">
        <div className="modal-header">
            <h4 className="modal-title">Reviews</h4>
            <button type="button" className="btn-close" data-bs-dismiss="modal">
            </button>
        </div>

        <div className="modal-body d-flex flex-column">
            {localStorage.getItem("token") === null ? (
                <button onClick={redirectToLogin} data-bs-dismiss="modal" className="btn btn-primary mb-4">
                    Log in to review
                </button>
            ) : (
                <><ReviewInput propertyID={propertyID} 
                               setSuccessMessage={setSuccessMessage}
                               setErrorMessage={setErrorMessage} />
                <h5 className="text-success mt-1 mb-3">{successMessage}</h5>
                <h5 className="text-success mt-1 mb-3">{errorMessage}</h5></>
            )}

            <h4 className="mb-2">
                {numReviews} {numReviews === 1 ? "review" : "reviews"}
            </h4>

            {comments.map((comment, index) => (
                <ReviewCard comment={comment} showReplies={true} owner={owner} key={index} />
            ))}

            {thereAreMoreResults ? (
                <LoadMoreCommentsButton currentPage={currentPage}
                setCurrentPage={setCurrentPage} />
            ) : (
                null
            )}
        </div>
    </div>
    </div>
    </div>;
}

async function appendNextPage(propertyID, comments, setComments, currentPage,
                              setThereAreMoreResults) {
    const response = await fetch(
        `http://localhost:8000/comments/property/${propertyID}/list?page=${currentPage}`);
    
    const data = await response.json();

    setComments(comments.concat(data.results));
    setThereAreMoreResults((data.next !== null));
}