import React, { useEffect, useState } from "react";
import ReviewCard from "../../../ReviewsSection/ReviewCard";
import LoadMoreButton from "./LoadMoreButton";
import ReplyInput from "./ReplyInput";

export default function RepliesDropDown({ dropDownID, rootComment, owner }) {
    const [replies, setReplies] = useState([]);
    const [thereAreMoreResults, setThereAreMoreResults] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        appendNextPage(rootComment, replies, setReplies, currentPage,
                       setThereAreMoreResults);
    }, [currentPage]);

    if (owner === null || owner === undefined) { return null; }

    return <div id={dropDownID} className="collapse mt-3">
        {replies.length === 0 ? (
            <h4>No replies</h4>
        ) : (
            <>
            {replies.map(reply => (
                <ReviewCard comment={reply} showReplies={false} key={reply.id} />
            ))}</>
        )}
        {thereAreMoreResults ? (
            <LoadMoreButton currentPage={currentPage}
                            setCurrentPage={setCurrentPage} />
        ) : (
            <ReplyInput rootComment={rootComment} replies={replies} owner={owner} />
        )}
    </div>;
}

async function appendNextPage(rootComment, replies, setReplies, currentPage,
    setThereAreMoreResults) {
    const rootCommentID = rootComment.id
    const response = await fetch(
    `http://localhost:8000/comments/replies/${rootCommentID}/list?page=${currentPage}`);

    const data = await response.json();

    setReplies(replies.concat(data.results));
    setThereAreMoreResults((data.next !== null));
}