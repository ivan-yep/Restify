import React, { useEffect, useState } from "react";
import PropertyCard from "../../components/Search/PropertyCard";
import SearchFilter from "../../components/Search/SearchFilter";
import LoadMoreButton from "../../components/Search/LoadMoreButton";
import "./style.css";


export default function Home() {
    const [properties, setProperties] = useState([]);
    // If default order by below doesn't match the default form, results will be
    // off when clicking 'load more' button.
    const [query, setQuery] = useState({order: "descending", by: "rating", guests: "",
                                        bedrooms: "", bathrooms: "", city: "",
                                        amenities: "", available_from: "",
                                        available_to: "", page: 1});
    const [thereAreMoreResults, setThereAreMoreResults] = useState(true);

    useEffect(() => {
        appendSearchResults(query, properties, setProperties, setThereAreMoreResults);
    }, [query]);

    return <main className="home-page">
        <SearchFilter query={query} setQuery={setQuery}
                      setProperties={setProperties} />

        {properties.length > 0
            ?   <>
                <div className="container-fluid px-4 pb-4 pt-2 d-flex flex-wrap">
                    {properties.map(property => (
                        <PropertyCard
                        key={property.id}
                        propertyID={property.id}
                        name={property.name}
                        location={property.city + ", " + property.country}
                        avgRating={property.average_rating}
                        thumbnailSource={property.images[0].image}
                        nightlyRate={property.price} /> 
                        ))}
                </div>
                {thereAreMoreResults
                ? <LoadMoreButton query={query} setQuery={setQuery} />
                : null}</>

            :   <h2 className="d-flex justify-content-center display-5 my-5">
                    Your search matched no results
                </h2>
        }
    </main>;
}

const appendSearchResults = async (query, properties, setProperties,
                                   setThereAreMoreResults) => {
    var queryParamString = Object.keys(query).reduce(
        (acc, curr) => acc + `${curr}=${query[curr]}&`,
        "?");
    var response = await fetch(`home${queryParamString}`);
    var data = await response.json();
    setProperties(properties.concat(data.results));
    setThereAreMoreResults(data.next !== null);
}