import React, { useState,useRef, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import { useParams } from 'react-router-dom';
import './style.css';

function EditProfile() {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [photo, setPhoto] = useState('');
  // const imageRef = useRef(null);

  const [errors, setErrors] = useState({
    username: '',
    first_name: '',
    last_name: '',
    tel: '',
    email: '',
    password1: '',
    password2: '',
    photo: '',
    non_field_errors: '', 
  });

  const navigate = useNavigate();
  const navigateToLogin = () => {
    // 👇️ navigate to create-property
    navigate('/login');
  };

  const navigateToProfile = () => {
    navigate(`/profile/${username}/view`);
  };
  const profileUser = useParams();

  
  const handleSubmit = (event) => {
    event.preventDefault();

    const token = localStorage.getItem('token');
    const currentUser = localStorage.getItem('username');
    
    var form_data = new FormData();
    var errors = false;
    form_data.append('username', username);
    form_data.append('first_name', firstName);
    form_data.append('last_name', lastName);
    form_data.append('email', email);
    form_data.append('tel', phone);
    if (password1){
      form_data.append('password1', password1);
    }
    if (password2){
      form_data.append('password2', password2);
    }
    if(photo){
      form_data.append('photo', photo);    
    }
    console.log('data that will be sent to fetch');
    // console.log(form_data.values());
    for (let [key, value] of form_data.entries()) {
      console.log(key, value);
    }

    // imageRef.current.value = null;
    fetch(`http://localhost:8000/accounts/${currentUser}/profile/edit`, {
      method: 'PATCH',
      headers: {
        // 'Content-Type': 'application/json',
        "Authorization": 'Bearer ' + token,
      },
      body: form_data,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.id){
            console.log('Success:', data);
            navigateToProfile();
        }
        else{
            setErrors(data);
        }
        console.log(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

      
    if (username){
      localStorage.setItem('username', username);
    }
  };

  const fetchUserData = () => {
    const token = localStorage.getItem('token');
    const currentUser = localStorage.getItem('username');

    document.title = 'Restify • Edit Profile';
    if (!token) {
      navigateToLogin();
    }
    fetch(`http://localhost:8000/accounts/${currentUser}/profile/edit`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setEmail(data.email);
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setPhone(data.phone);
        setUsername(data.username);
        setPhone(data.tel);
        // setPhoto(data.photo);
        // console.log(data.photo);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  useEffect(() => {
    fetchUserData();
  }, []);
  return (
    <body className="edit-profile">
    <main>
    <div className="card-body p-5 shadow-5 text-center">
      <h2 className="fw-bold mb-5">Create New Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="form-outline">
              <input
                type="text"
                id="firstName"
                className="form-control"
                required
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
              />
              <label className="form-label" htmlFor="firstName">
                First name
              </label>
              {errors.first_name && (
                <div className="text-danger">{errors.first_name}</div>
              )}
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="form-outline">
              <input
                type="text"
                id="lastName"
                className="form-control"
                required
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
              />
              <label className="form-label" htmlFor="lastName">
                Last name
              </label>
              {errors.last_name && (
                <div className="text-danger">{errors.last_name}</div>
              )}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="form-outline">
              <input
                type="tel"
                id="phone"
                className="form-control"
                required
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
              <label className="form-label" htmlFor="phone">
                Phone Number
              </label>
              {errors.tel && (
                <div className="text-danger">{errors.tel}</div>
              )}
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="form-outline">
              <input type="text" id="username" className="form-control"  onChange={(event) => setUsername(event.target.value)} required value={username} />
              <label className="form-label" htmlFor="username">Username</label>
                {errors.username && (
                <div className="text-danger">{errors.username}</div>
                )}
            </div>
          </div>
        </div>


        <div className="form-outline mb-4">
          <input type="email" id="email" className="form-control" required value={email} readOnly />
          <label className="form-label" htmlFor="email">Email address</label>
          {errors.username && (
                <div className="text-danger">{errors.email}</div>
                )}
        </div>

        <div className="form-outline mb-4">
          <input type="password" id="password1" className="form-control" value={password1} onChange={(event) => setPassword1(event.target.value)} />
          <label className="form-label" htmlFor="password1">Password</label>
          {errors.password1 && (
                <div className="text-danger">{errors.password1}</div>
                )}
        </div>

        <div className="form-outline mb-4">
          <input type="password" id="password2" className="form-control" value={password2} onChange={(event) => setPassword2(event.target.value)} />
          <label className="form-label" htmlFor="password2">Repeat Password</label>
          {errors.password2 && (
                <div className="text-danger">{errors.password2}</div>
                )}
        </div>

        <div className="form-outline mb-4">
        <input type="file" id="photo" className="form-control" accept="image/*" onChange={(event) => setPhoto(event.target.files[0])} />
          <label className="form-label" htmlFor="password2">Upload profile image</label>
          {errors.photo && (
                <div className="text-danger">{errors.photo}</div>
                )}
        </div>
        {errors.non_field_errors && (
                <div className="text-danger">{errors.non_field_errors}</div>
                )}
        <button type="submit" className="btn btn-primary btn-block mb-4">Finish</button>

      </form>
    </div>
    </main>
    </body>
  );
}

export default EditProfile;
