import React, { useEffect, useState } from "react";

export default function ReplyInput({ rootComment, replies, owner }) {
    const [canReply, setCanReply] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        setCanReplyAughh(rootComment, replies, owner, setCanReply);
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const reply = event.target.reply.value;
        const submitted = submitReply(reply, rootComment);
        if (submitted) {
            setCanReply(false);
            setSuccessMessage("Reply submitted");
        }
    }

    if (!canReply) {
        return <h3 className="text-success mt-3 mb-2">{successMessage}</h3>;
    }
    
    return <form onSubmit={handleSubmit} className="border border-1 rounded p-3">
        <label htmlFor="reply" className="form-label">Reply</label>
        <textarea name="reply" id="reply" rows="3" className="form-control"
        placeholder="Leave a reply" required>
        </textarea>
        <button type="submit" className="btn btn-primary">Submit reply</button>
    </form>;
    
}

async function setCanReplyAughh(rootComment, replies, owner, setCanReply) {
    if (owner === null || owner === undefined) {
        setCanReply(false);
        return;
    }

    const reservationID = rootComment.reservation
    const reservationResponse = await fetch(`http://localhost:8000/reservation/${reservationID}/get`);
    const reservationData = await reservationResponse.json();

    const guestID = reservationData.guest.id;
    const guestResponse = await fetch(`http://localhost:8000/accounts/profile/no_auth/${guestID}`);
    const guestData = await guestResponse.json();
    const guestUsername = guestData.username;

    const ownerUsername = owner.username;

    const currentUsername = localStorage.getItem("username");
    if (![guestUsername, ownerUsername].includes(currentUsername)) {
        setCanReply(false);
        return;
    }

    const latestReply = (replies.length === 0 ? rootComment : replies[replies.length - 1]);
    const latestReplierResponse = await fetch(`http://localhost:8000/accounts/profile/no_auth/${latestReply.commenter}`);
    const latestReplierData = await latestReplierResponse.json();
    const latestReplierUsername = latestReplierData.username;

    if (currentUsername === latestReplierUsername) {
        setCanReply(false);
        return;
    }
    setCanReply(true);
}

async function submitReply(reply, rootComment) {
    const reservationID = Number(rootComment.reservation);
    const authToken = localStorage.getItem("token");
    const formData = {"reservation": reservationID, "comment": reply};
    const response = await fetch(
        "http://localhost:8000/comments/property/reply/write",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify(formData)
        });
    return response.ok;
}