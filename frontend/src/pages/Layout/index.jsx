import { Outlet, Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import './style.css';
import Badge from '@mui/material/Badge';

const getTitle = (type, reservation) => {
    var title = ""
    if (type === "RR") {
        title = `New reservation request from ${reservation.guest.username} for ${reservation.property.name}!`
    }
    else if (type === "CR") {
        title = `New cancellation request from ${reservation.guest.username} for ${reservation.property.name}`
    }
    else if (type === "RA") {
        title = `Your reservation for ${reservation.property.name} has been approved by ${reservation.property.owner.username}!`
    }
    else {
        title = `Your cancellation for ${reservation.property.name} has been approved by ${reservation.property.owner.username}`
    }

    return title;
}


const weekMonthDayYearFormat = (dateString) => {
    const dateObject = new Date(Date.parse(dateString));
    return dateObject.toDateString();
}

function Layout(props) {
    const { authenticated } = props;
    const [notifications, setNotifications] = useState([])
    const [totalNotifications, setTotalNotifications] = useState(null)
    const [cursor, setCursor] = useState("")
    const [morePages, setMorePages] = useState(true)

    const removeNotification = (id) => {
        if (localStorage.getItem("token") !== null) {
            fetch(`http://localhost:8000/notifications/readclear/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            })
                .then(() => {
                    setTotalNotifications(totalNotifications - 1)
                    setNotifications((oldState) => oldState.filter((item) => item.id !== id));
                })
        }
    };

    useEffect(() => {
        if (localStorage.getItem("token") !== null) {
            fetch(`http://localhost:8000/notifications/list?cursor=${cursor}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.results) {
                        var notificationCards = data.results;

                        if (data.next !== null) {
                            localStorage.setItem('cursor', data.next.substring(data.next.indexOf("cursor") + 7));
                            setMorePages(true)
                        } else {
                            setMorePages(false)
                        }

                        if (cursor === "") {
                            setNotifications((notificationCards));
                        } else {
                            setNotifications(notifications.concat(notificationCards));
                        }

                        setTotalNotifications(data.count)
                    }
                })
        }
    }, [cursor, authenticated]);

    return (
        <>
            <header className="nav-bar-component">
                <Navbar expand="sm">
                    <Container>
                        <Navbar.Brand as={Link} to="/">Restify</Navbar.Brand>

                        <Navbar.Toggle aria-controls="restify-navbar" />
                        <Navbar.Collapse id="restify-navbar">

                            {authenticated === false ?
                                <>
                                    <Nav className="me-auto">
                                        <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                        <Nav.Link as={Link} to="/register">Sign Up</Nav.Link>
                                    </Nav>
                                </> :
                                <>
                                    <Nav className="me-auto">
                                        <Nav.Link as={Link} to="/my-properties">Properties</Nav.Link>
                                        <Nav.Link as={Link} to="/my-reservations">Reservations</Nav.Link>
                                        <NavDropdown title="Profile" id="restify-navbar">
                                            {/* Link to view and edit profile pages once they are completed */}
                                            <NavDropdown.Item as={Link} to={`/profile/${localStorage.getItem("username")}/view`}>View Profile</NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/logout">Logout</NavDropdown.Item>
                                        </NavDropdown>
                                        <NavDropdown title={
                                            totalNotifications > 0 ?
                                                <>
                                                    <Badge onClick={() => { setCursor("") }} badgeContent={totalNotifications} sx={{
                                                        "& .MuiBadge-badge": {
                                                            color: "white",
                                                            backgroundColor: "#15133C"
                                                        }
                                                    }}>

                                                        <span><i className="fa-solid fa-bell"></i></span>
                                                    </Badge>
                                                </> :
                                                <>
                                                    <span><i className="fa-solid fa-bell"></i></span>
                                                </>
                                        }
                                            id="restify-navbar">

                                            {

                                                notifications.length > 0 ?
                                                    <>
                                                        <div className="overflow-y-scroll">
                                                            {notifications.map((notification) => {
                                                                return (
                                                                    <Nav.Item>
                                                                        <div className="card">
                                                                            <div className="card-body">
                                                                                <p className="card-title">{weekMonthDayYearFormat(notification.date_time)}</p>
                                                                                <p className="card-text">{getTitle(notification.notification_type, notification.reservation)}</p>
                                                                                <button class="btn btn-primary btn-sm" onClick={() => { removeNotification(notification.id) }}>Clear</button>
                                                                            </div>
                                                                        </div>
                                                                    </Nav.Item>
                                                                )
                                                            })}
                                                            {
                                                                (morePages === true) && <div id="load-more"><button onClick={() => { setCursor(localStorage.getItem("cursor")) }} className="btn btn-primary btn-sm">See More</button></div>
                                                            }
                                                        </div>
                                                    </> : <p className="empty-notifications">No new notifications</p>
                                            }
                                        </NavDropdown>
                                    </Nav>
                                </>
                            }
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </header>
            <Outlet />

            {/* <footer>
                <div>
                    © 2023 Copyright by Asma Surti, Ivan Li, Yifan Li
                </div>
            </footer> */}
        </>
    )
}

export default Layout;