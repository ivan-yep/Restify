import React from "react";
import { Field, ErrorMessage } from "formik";

function PropertyNumberDropdown(props) {
    const {label_text, select_name, icon_name} = props;

    var options = []
    for (let i = 1; i <= 10; i++) {
        options.push(<option key={i} value={i}>{i}</option>)
    }

    return <div className="mb-3">
        <label className="form-label">{label_text}</label>
        <div className="input-group mb-3">
            <label className="input-group-text">
                <i className={icon_name}></i>
            </label>
            <Field className="form-select" name={select_name} as="select">
                {options}
            </Field>
            <ErrorMessage name={select_name} component="span" className="error" />
        </div>
    </div>
}

export default PropertyNumberDropdown;