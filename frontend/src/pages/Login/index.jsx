import React, { useState } from 'react';
import {Link, useNavigate} from "react-router-dom";
import "./style.css";

function Login(props) {
  const { setLoggedInNavBar } = props
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorStatement, setErrorStatement] = useState('');
  // setErrorStatement('');

  const navigate = useNavigate();
  const navigateToCreate = () => {
    // 👇️ navigate to create-property
    navigate('/register/');
  };
  const navigateToProfile = () => {
    navigate(`/profile/${username}/view`);
  };
  
  const handleSubmit = async (event) => {
    console.log(username);
    console.log(password);
    event.preventDefault();
    fetch("http://localhost:8000/accounts/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({username: username, password: password}),
  })
      .then((response) => response.json())
      .then((data) => {
          console.error("Response:", data);
          if (data.detail){
            setErrorStatement('Invalid username or password, please try again');
          }
          else{
            localStorage.setItem('token', data.access);
            localStorage.setItem('refresh', data.refresh);
            localStorage.setItem('username', username); 
            setErrorStatement('Login success!');
            setLoggedInNavBar();
            navigateToProfile();
            // console.log(localStorage.getItem('token'));
            // console.log(localStorage.getItem('refresh'));
            // console.log(localStorage.getItem('username'));
          }
      })
      .catch((error) => {
          console.error("Error:", error);
      });
}
  

  return (
    <body className="login">
    <main>
    <div class="card mb-3">
      <div class="card-body py-5 px-md-5" id="login-form">
    <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <div class="form-outline mb-4">
          <input type="input" id="email-add" class="form-control" required value={username} onChange={(e) => setUsername(e.target.value)} />
            <label class="form-label" for="email-add">Username</label>
          </div>

          <div class="form-outline mb-4">
          <input type="password" id="pwd" class="form-control" required value={password} onChange={(e) => setPassword(e.target.value)} />

            <label class="form-label" for="pwd">Password</label>
          </div>

          {errorStatement && (
            <div className="form-outline mb-4">
              <p className="text-danger">{errorStatement}</p>
            </div>
          )}

          <div class="form-outline mb-4">
          <Link to="/register">Create Account?</Link> 
          </div>
          <button type="submit" class="btn btn-primary btn-block mb-4">Sign in</button>
          
    </form>
    </div>
    </div>
    </main>
    </body>
  );
}

export default Login;