import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'

// Componenet imports
import ListProperties from './pages/MyProperties';
import Home from './pages/Home';
import PropertyDetails from './pages/PropertyDetails';
import PropertyReservation from './pages/PropertyReservations';
import UserReservations from './pages/MyReservations';
import Login from './pages/Login';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Logout from './pages/Logout';
import CreateUser from './pages/CreateUser';
import EditProperty from './pages/EditProperty';
import CreateProperty from './pages/CreateProperty';
import Layout from './pages/Layout';

// Common styling for all pages 
import "./App.css"

function App() {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("token") === null ? false:true)

  const onLogIn = () => {
    setLoggedIn(true)
  }

  const onLogOut = () => {
    setLoggedIn(false)
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout authenticated={loggedIn}/>}>
          <Route path='/'>
            <Route index element={<Home />} />
            <Route path="property-details/:propertyID" element={<PropertyDetails />} />
          </Route>
          <Route path='/my-properties/'>
            <Route index element={<ListProperties />} />
            <Route path="create-property" element={<CreateProperty />} />
            <Route path="edit/:propertyID" element={<EditProperty />} />
            <Route path="reservations/:propertyID/:name" element={<PropertyReservation />} />
          </Route>
          <Route path='/profile/'>
            <Route path=':username/view' element={<Profile />} />
            <Route path=':username/edit' element={<EditProfile />} />
          </Route>
          <Route path='/login'>
            <Route index element={<Login setLoggedInNavBar={onLogIn}/>} />
          </Route>
          <Route path='/register'>
            <Route index element={<CreateUser />} />
          </Route>
          <Route path='/my-reservations'>
            <Route index element={<UserReservations />} />
          </Route>
        </Route>

        <Route path='/logout'>
          <Route index element={<Logout setLoggedOutNavBar={onLogOut}/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
