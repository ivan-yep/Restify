import React, { useEffect, useState } from "react";
import ReviewCard from "./ReviewCard";
import ReviewsModal from "../Modals/ReviewsModal";

export default function ReviewsSection({ propertyID, avgRating, owner }) {
    const [numReviews, setNumReviews] = useState(0);
    const [firstComment, setFirstComment] = useState(null);

    useEffect(() => { 
        getNumReviewsAndFirst(propertyID, setNumReviews, setFirstComment);
    }, []);
//  | {avgRating} {avgRating === 1 ? "star" : "stars"}
    return <div className="container d-flex flex-column border-top border-secondary py-4">

        {numReviews === 0 ? (
            <h2 className="text-center text-wrap">
                Be the first to leave a review
            </h2>
        ) : (
            <>
            <h4>{numReviews} {numReviews === 1 ? "review" : "reviews"}</h4>
            <ReviewCard comment={firstComment} showReplies={false} />
            </>
        )}
        <button type="button" data-bs-toggle="modal" data-bs-target="#reviews"
        id="view-reviews" className="btn btn-primary mt-3">
            Reviews
        </button>
        <ReviewsModal propertyID={propertyID} numReviews={numReviews}
            avgRating={avgRating} owner={owner} />
   
    </div>;
}

async function getNumReviewsAndFirst(propertyID, setNumReviews,
                                            setFirstComment) {
    const response = await fetch(
        `http://localhost:8000/comments/property/${propertyID}/list`);
    const data = await response.json();

    setNumReviews(data.count);
    setFirstComment((data.count > 0 ? data.results[0] : null));
    // console.log((data.count > 0 ? typeof data.results[0].commenter : null));
}

/*  Comment skeleton
comment:
commenter:
date_time:
rating:
receiver:
reservation:
*/