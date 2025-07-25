import React from 'react';
import { useNavigate } from "react-router-dom";
import "./style.css";

function Logout(props){
    // console.log(localStorage.getItem('username'));
    // console.log(localStorage.getItem('token'));
    // console.log(localStorage.getItem('username'));
    const {setLoggedOutNavBar} = props;
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    localStorage.removeItem('username');
    localStorage.removeItem('cursor')
    setLoggedOutNavBar()
    const navigate = useNavigate();

    const handleSubmit = () => {
        console.log('got here');
        navigate('/');
    }
    // console.log(localStorage.getItem('username'));
    // console.log(localStorage.getItem('token'));
    // console.log(localStorage.getItem('username'));
    return (
        <body className="logout">
        <main>
        <div class="card mb-3">
        <div class="signout-comp">
            <h1>Sign Out</h1>
            <p>You have successfully signed out</p>
            <button type="button" class="btn btn-primary btn-block mb-4" onClick={handleSubmit}>Continue</button>
        </div>
        </div>
        </main>
        </body>
    )
}


export default Logout;