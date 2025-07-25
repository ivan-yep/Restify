import React from "react";

export default function ShowRepliesButton({ dropDownID }) {
    return <button type="button" data-bs-toggle="collapse"
    data-bs-target={`#${dropDownID}`} className="btn btn-secondary mt-2">Replies</button>;
}