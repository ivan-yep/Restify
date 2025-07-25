import React from "react";
import DescriptionModal from "../Modals/DescriptionModal";

export default function DescriptionSection({ description }) {

    if (description === null || description === undefined) { 
        return null;
    }
    return <div className="container border-top border-secondary py-4">
        {description.length <= 500
        ?
            <p>{description}</p>   
        :
            <>
            <p>{description.slice(0, 500) + " ..."}</p>
            <button type="button" data-bs-toggle="modal"
            data-bs-target="#description" className="border-0 bg-transparent p-0">
                <u>Read more</u>
            </button>
            <DescriptionModal description={description} />
            </>}
                        
    </div>;
}

// description = `Communicating data between React components is crucial
    // as it allows you to create more dynamic web applications. But since React
    // has only one-way data flow, it can get tricky to communicate or send data to
    //  other components.To update the state in a parent component, you have to pass
    //   the data into the callback prop. Instead of giving the data or state into the
    //    callback prop, you can send it directly to an external method to complete
    // a specific task. In this guide, you'll learn how to submit a component's state
    // to an external method. his guide, you'll learn howatly to an external method to complete
    // a specific task. In this guide, you'll learn how to submit a component's state
    // to an external method. his guide, you'll learn howa`