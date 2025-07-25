import React from "react";
import SearchFilterOpenButton from "./SearchFilterOpenButton";
import SearchFilterModal from "./SearchFilterModal";

function SearchFilter({ query, setQuery, setProperties }) {
    return (<>
        <SearchFilterOpenButton />
        <SearchFilterModal query={query} setQuery={setQuery}
                           setProperties={setProperties} />
    </>);
}

export default SearchFilter;