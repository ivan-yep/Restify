import React from "react";

function OrderBySelection() {
    return (<>
        <h4 className="mb-3">Order</h4>
        <BySelection />
        <OrderSelection />
    </>);
}

function BySelection() {
    return (
    <div className="row mx-1 mb-2">
        <div className="form-check col-6">
            <input value="price" className="form-check-input" type="radio" name="orderBy" id="order-by-price" />
            <label className="form-check-label" htmlFor="order-by-price">
                Price
            </label>
        </div>
        <div className="form-check col-6">
            <input value="rating" className="form-check-input" type="radio" name="orderBy" id="order-by-rating" defaultChecked />
            <label className="form-check-label" htmlFor="order-by-rating">
                Rating
            </label>
        </div>
    </div>);
}

function OrderSelection() {
    return (
    <div className="row mx-1 mb-4 pt-2 border-top">
        <div className="form-check col-6">
            <input value="ascending" className="form-check-input" type="radio" name="order" id="ascending" />
            <label className="form-check-label" htmlFor="ascending">
                Ascending
            </label>
        </div>
        <div className="form-check col-6">
            <input value="descending" className="form-check-input" type="radio" name="order" id="descending" defaultChecked />
            <label className="form-check-label" htmlFor="descending">
                Descending
            </label>
        </div>
    </div>);
}

export default OrderBySelection;