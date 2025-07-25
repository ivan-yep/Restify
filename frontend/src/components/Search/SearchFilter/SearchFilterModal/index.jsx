import React, { useState } from "react";
import SearchFilterForm from "./SearchFilterForm";

function SearchFilterModal({ query, setQuery, setProperties }) {
    const [formIsValid, setFormIsValid] = useState(true);

    return <>
    <div className="modal fade" id="search">
        <div className="modal-dialog modal-dialog-scrollable modal-fullscreen-sm-down modal-md">
            <div className="modal-content">

                <div className="modal-header">
                    <h4 className="modal-title">Filter and sort</h4>
                    <button type="button" className="btn-close" data-bs-dismiss="modal">
                    </button>
                </div>

                <div className="modal-body">
                    <SearchFilterForm query={query} setQuery={setQuery}
                                      setProperties={setProperties}
                                      setFormIsValid={setFormIsValid} />
                </div>

                <div className="modal-footer d-flex">
                    <button type="submit" form="search-filter-form"
                            className="flex-fill btn btn-primary border"
                            data-bs-dismiss="modal" id="submitSearchButton"
                            disabled={!formIsValid}>
                        See results
                    </button>
                </div>
            </div>
        </div>
    </div>
    </>;
}



export default SearchFilterModal;