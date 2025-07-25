import React, { useEffect, useState } from "react";
import ShowRepliesButton from "../../Modals/ReviewsModal/ShowRepliesButton";
import RepliesDropDown from "../../Modals/ReviewsModal/RepliesDropdown";
import ReviewComment from "./ReviewComment";

export default function ReviewCard({ comment, showReplies, owner }) {

    // Set default values (for the ones needed) to prevent rendering error.
    const [commenter, setCommenter] = useState({username: "", photo: ""});
    useEffect(() => {
        getUserByID(comment.commenter, setCommenter);
    }, []);

    return <>
    <div className="card">
        <div className="card-header d-flex bg-transparent">
            <img src={commenter.photo} alt="pfp" className="rounded-circle border img-fluid w-25" />
            <div className="d-flex flex-column justify-content-center ms-4">
                <h4 className="mb-0">
                    {commenter.username}
                    {typeof(comment.rating) === "number" ? (
                        ` | ${comment.rating} stars`
                        ) : ""}
                </h4>
                <p>{weekMonthDayYearFormat(comment.date_time)}</p>
            </div>
        </div>
        <div className="card-body">
            <ReviewComment comment={comment.comment} />
            {showReplies ? (
                <><ShowRepliesButton dropDownID={`dropDown${comment.id}`} />
                <RepliesDropDown dropDownID={`dropDown${comment.id}`}
                    rootComment={comment} owner={owner} /></>
            ) : (null)}
        </div>
        
    </div>
    </>;
}

/*  Comment skeleton
comment:
commenter:
date_time:
rating:
receiver:
reservation:
*/

function weekMonthDayYearFormat(dateString) {
    const dateObject = new Date(Date.parse(dateString));
    return dateObject.toDateString();
}

async function getUserByID(userID, setUser) {
    const response = await fetch(
        `http://localhost:8000/accounts/profile/no_auth/${userID}`);
    const data = await response.json();
    setUser(data);
}