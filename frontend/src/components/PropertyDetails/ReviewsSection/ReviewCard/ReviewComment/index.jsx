import React, { useEffect, useState } from "react";

export default function ReviewComment({ comment }) {
    const [displayComment, setDisplayComment] = useState("");
    const [commentIsShortened, setCommentIsShortened] = useState(false);

    useEffect(() => {
        if (comment.length > 300) {
            setCommentIsShortened(true);
            setDisplayComment(comment.slice(0, 300) + " . . . ");
        } else {
            setDisplayComment(comment);
        }
    }, []);

    const handleReadMore = () => {
        setDisplayComment(comment);
        setCommentIsShortened(false);
    }

    return <div>
        {displayComment}
        {commentIsShortened ? (
            <div className="mx-0 px-0">
                <button onClick={handleReadMore}
                className="btn btn-link text-secondary mx-0 px-0">Read more</button>
            </div>
        ) : (
            null
        )}
    </div>
}