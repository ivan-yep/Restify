import React from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import './style.css'
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import ReviewCard from "../../components/PropertyDetails/ReviewsSection/ReviewCard";


function Profile() {
  const { username } = useParams();
  // const [userID, setUserID] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [photo, setPhoto] = useState('');
  const [phone, setPhone] = useState('');
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [displayedComments, setDisplayedComments] = useState([]);
  const [isSelf, setIsSelf] = useState(false);
  const [hasComments, setHasComments] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [canComment, setCanComment] = useState(false);
  const [commentReservations, setCommentReservations] = useState([]);
  const [reservation, setReservation] = useState('');
  const [reservationChoices, setReservationChoices] = useState([]);
  const [rating, setRating] = useState('');
  const [commentsPerPage, setCommentsPerPage] = useState(2);
  const [hasRatings, setHasRatings] = useState(false);
  const [avgRating, setAvgRating] = useState('');
  const [numRatings, setNumRatings] = useState('');
  const [lastCommentIndex, setLastCommentIndex] = useState(0);
  const [commentErrors, setCommentErrors] = useState('');

  const handleCommentsModalOpen = () => setShowCommentsModal(true);
  const handleCommentsModalClose = () => setShowCommentsModal(false);

  const currentUser = localStorage.getItem('username');
  const [currentID, setCurrentID] = useState('');


  const navigate = useNavigate();
  var num_ratings = 0;
  var sum_ratings = 0;
  const navigateToLogin = () => {
    navigate('/login');
  };

  const navigateToEditProfile = () => {
    navigate(`/profile/${username}/edit`)
  }
  var userID = null;
  // var currentID = null;
  const reservations_so_far = [];
  var reservation_ids = [];
  const handleSubmit = () => {
    getCurrentID();
    getUserIDs();
    console.log('get current id')
    console.log(currentID);
    console.log(reservation);
    console.log(rating);
    if (!comment) {
      setCommentErrors('Please enter a comment');
    }
    else {
      var data = {
        reservation: reservation.id,
        'commenter': currentID,
        'receiver': username,
        'comment': comment,
      }

      console.log(data);
      if (rating) {
        data.rating = rating;
      }

      fetch(`http://localhost:8000/comments/user/write`, {
        method: "POST",
        headers: {
          "Authorization": 'Bearer ' + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
      setShowCommentsModal(false);
      // navigate(`/profile/${username}/view`);

      window.location.reload(false);
    }

  }

  const getUserIDs = async () => {
    fetch(`http://localhost:8000/accounts/${username}/profile`, {
      method: "GET",
      headers: {
        "Authorization": 'Bearer ' + token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.id);
        setEmail(data.email);
        setPhone(data.tel);
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setPhoto(data.photo);
        userID = data.id;
      }).catch((error) => {
        console.error("Error:", error);
      });
  }

  const getCurrentID = async () => {
    fetch(`http://localhost:8000/accounts/${currentUser}/profile`, {
      method: "GET",
      headers: {
        "Authorization": 'Bearer ' + token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCurrentID(data.id);
        console.log(currentID);
      }).catch((error) => {
        console.error("Error:", error);
      });
  }

  async function getAllUserComments(username, authToken) {
    const comments = [];
    var response = null;
    var data = null;
    var fetchURL = `http://localhost:8000/comments/user/${username}/list`;

    do {
      response = await fetch(fetchURL, {
        method: "GET",
        headers: { Authorization: `Bearer ${authToken}` }
      });
      data = await response.json();
      // console.log('getAllUser');
      // console.log(...data.results);
      comments.push(...data.results);
      // reservation_id.push(...data.results);
      fetchURL = data.next;
    } while (fetchURL != null);
    console.log('within getComments')
    console.log(comments);
    return comments;
  }


  async function getAllUserReservations(username, authToken) {
    const reservations = [];
    var response = null;
    var data = null;
    var fetchURL = `http://localhost:8000/reservation/${username}/list?user_type=host`;

    do {
      response = await fetch(fetchURL, {
        method: "GET",
        headers: { Authorization: `Bearer ${authToken}` }
      });
      data = await response.json();
      // console.log('getAllUser');
      // console.log(...data.results);
      reservations.push(...data.results);
      // reservation_id.push(...data.results);
      fetchURL = data.next;
    } while (fetchURL != null);
    console.log('within getAllUser')
    console.log(reservations);
    return reservations;
  }

  const token = localStorage.getItem('token');


  useEffect(() => {
    document.title = 'Restify • Profile';
    if (!token) {
      navigateToLogin();
    }

    if (currentUser === username) {
      setIsSelf(true);
    }


    // const getAllReservations = async () =>{
    //   const reservations = await getAllUserReservations(currentUser, token);
    //   reservations_so_far = reservations;
    //     for (let i = 0; i < reservations.length; i++){
    //       if (reservations[i].guest == userID && (reservations[i].status === 'CA' || reservations[i].status == 'T' || reservations[i].status == 'CO')){
    //         // console.log(reservations[i]);
    //         reservations_so_far.push(reservations[i]);
    //         reservation_ids.push(reservations[i].id);
    //       }
    //     }
    //     // console.log(result);

    // }

    // getAllReservations();
    // console.log(reservations[[Prototype]]);
    // reservations_so_far.push(reservations[[results]]);
    console.log('getting all reservations')
    console.log(reservations_so_far);
    console.log(reservation_ids);

    fetch(`http://localhost:8000/accounts/${currentUser}/profile`, {
      method: "GET",
      headers: {
        "Authorization": 'Bearer ' + token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCurrentID(data.id);
        console.log(currentID);
      }).catch((error) => {
        console.error("Error:", error);
      });

    fetch(`http://localhost:8000/accounts/${username}/profile`, {
      method: "GET",
      headers: {
        "Authorization": 'Bearer ' + token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.id);
        setEmail(data.email);
        setPhone(data.tel);
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setPhoto(data.photo);
        userID = data.id;
        console.log(userID);
      }).catch((error) => {
        console.error("Error:", error);
      });

    const comments = getAllUserComments(username, token);
    comments.then((data) => {
      console.log('list of comments');
      console.log(data[0]);
      console.log(data.length);
      const reservations = getAllUserReservations(currentUser, token);
      reservations.then((results) => {
        // results.forEach(data => reservations_so_far.push(data))
        console.log('the result');
        console.log(results);
        console.log(results.length);
        for (let i = 0; i < results.length; i++) {
          // console.log('in here');
          // console.log(results[i]);
          if (results[i].guest.username == username && (results[i].status === 'CA' || results[i].status == 'T' || results[i].status == 'CO')) {
            console.log(results[i]);
            reservations_so_far.push(results[i]);
            reservation_ids.push(results[i].id);
          }
        }
        // console.log(results);
        console.log('we are in reservations');
        console.log(reservations_so_far);

        console.log(data);
        console.log(data[0]);
        console.log(data.length);
        if (data.length > 0) {
          console.log('we got true here for some reason');
          setHasComments(true);
          var comments_so_far = [];
          var fetchPromises = [];
          console.log(data);
          setLastCommentIndex(data.length);
          console.log(reservations_so_far);
          console.log(reservation_ids);
          for (let i = 0; i < data.length; i++) {
            console.log(data[i]);
            var commenter = data[i].commenter;
            const comment_so_far = data[i];
            const reservation = data[i].reservation;
            // const comment = data[i].comment;
            // const date = data[i].date_time.slice(0, 10);
            const currRating = data[i].rating;

            if (currRating) {
              sum_ratings = sum_ratings + currRating;
              num_ratings++;
            }
            fetchPromises.push(
              fetch(`http://localhost:8000/accounts/profile/${commenter}`, {
                method: "GET",
                headers: {
                  "Authorization": 'Bearer ' + token,
                },
              })
                .then((response) => response.json())
                .then((comment_data) => {
                  console.log(comment_data);
                  // commenter = data.first_name + ' ' + data.last_name; 
                    console.log(reservation);
                  if (comment_data.username === currentUser) {
                    console.log('current reservation');
                    // console.log(reservations_so_far);
                    console.log('got to here yay')
                    const index = reservation_ids.indexOf(reservation);
                    console.log(index);
                    reservations_so_far.splice(index, 1);
                    reservation_ids.splice(index, 1);
                    if (reservation === 37){
                      console.log('checking 36')
                      console.log(reservations_so_far);
                      console.log(reservations_so_far.length);

                    }
                  }
                  console.log('got to here 2');
                  comments_so_far.push(
                    <ReviewCard comment={comment_so_far} showReplies={false} />
                  );
                })
            );
          }

          if (num_ratings > 0) {
            setHasRatings(true);
            setNumRatings(num_ratings);
            setAvgRating(sum_ratings / num_ratings);
          }

          // Wait for all fetch promises to resolve before updating state
          Promise.all(fetchPromises).then(() => {
            setComments(comments_so_far.reverse());
            console.log('comments so far');
            console.log(comments_so_far);
            console.log('reservations_so_far');
            console.log(reservations_so_far);
            if (reservations_so_far.length > 0) {
              setCanComment(true);
              var temp_reservations = []
              reservations_so_far.forEach(data => {
                temp_reservations.push(<option id={data.id} >{data.id}: {data.start_date} to {data.end_date}</option>)
              })
              console.log('saving as choice');
              console.log(temp_reservations);
              setReservationChoices(temp_reservations);
              setReservation(reservations_so_far[0]);
            }
          });

          setCommentReservations(reservations_so_far);
          console.log(reservations_so_far);
        }
        else{
          if (reservations_so_far.length > 0) {
            setCanComment(true);
            var temp_reservations = []
            reservations_so_far.forEach(data => {
              temp_reservations.push(<option id={data.id} >{data.id}: {data.start_date} to {data.end_date}</option>)
            })
            console.log('saving as choice');
            console.log(temp_reservations);
            setReservationChoices(temp_reservations);
            setReservation(reservations_so_far[0]);
          }
        }
      }
      );

    });
  }, []);

  return (
    <section className="vh-100" style={{ backgroundColor: '#f4f5f7' }}>
      <Container className="py-5 h-100">
        <Row className="d-flex justify-content-center align-items-center h-100">
          <Col lg={6} className="mb-4 mb-lg-0">
            <Card className="mb-3" style={{ borderRadius: '.5rem' }}>
              <Row className="g-0">
                <Col md={4} className="gradient-custom text-center text-white"
                  style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }}>
                  <Card.Img src={photo}
                    alt="Avatar" className="img-fluid my-5" style={{ width: '80px' }} />
                </Col>
                <Col md={8}>
                  <Card.Body className="p-4">
                    <h6>{firstName} {lastName}</h6>
                    <hr className="mt-0 mb-4" />
                    <Row className="pt-1">
                      <Col sm={6} className="mb-3">
                        <h6>Email</h6>
                        <p className="text-muted">{email}</p>
                      </Col>
                      <Col sm={6} className="mb-3">
                        <h6>Phone</h6>
                        <p className="text-muted">{phone}</p>
                      </Col>
                    </Row>
                    <h6>Past User Comments</h6>
                    <hr className="mt-0 mb-4" />
                    {hasComments ? (
                      <Row className="pt-1">
                        {comments[0]}
                      </Row>

                    ) : <p>There are currently no comments for this user</p>
                    }
                    <p>{hasComments}</p>

                    {hasComments ? (
                      <Button variant="primary" block className="mb-4" onClick={handleCommentsModalOpen}>
                        View All Comments
                      </Button>

                    ) : null}

                    {!hasComments && canComment ? (
                      <Button variant="primary" block className="mb-4" onClick={handleCommentsModalOpen}>
                        Write Comment
                      </Button>
                    ) : null}
                    <hr className="mt-0 mb-4" />

                    {isSelf ? (
                      <Button
                        variant="primary"
                        block
                        className="mb-4"
                        onClick={navigateToEditProfile}
                      >
                        Edit Profile
                      </Button>
                    ) : null}

                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
      <Modal show={showCommentsModal} onHide={handleCommentsModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>All Comments</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {canComment ? (
            <Row className="pt-1">

              <label for="reservation">Select a reservation to comment for: </label>
              <select id="reservation" value={reservation} onChange={(e) => setReservation(e.target.value)}>
                {reservationChoices}
              </select>
              <label for="comment">Comment:</label>
              <textarea id="comment" name="comment" rows="4" cols="40" required onChange={(e) => setComment(e.target.value)}></textarea>
              <hr className="mt-0 mb-4" />

              <label for="rating">Provide an optional rating: </label>
              <select id="rating" value={rating} onChange={(e) => setRating(e.target.value)}>
                <option value="">-- Please select an option --</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>

              <hr className="mt-0 mb-4" />
              {commentErrors && (
                <div className="form-outline mb-4">
                  <p className="text-danger">{commentErrors}</p>
                </div>
              )}

              <Button variant="primary" block className="mb-4" onClick={handleSubmit}>
                Submit
              </Button>
            </Row>
          ) : null}
          <h4>{comments.length} comments</h4>
          <Row className="pt-1">
            {hasRatings ? (
              <h5>{numRatings} Ratings that average to {avgRating.toFixed(2)} stars</h5>
            ) : <h4>This user has currently not been rated</h4>}
            {comments.slice(0, commentsPerPage)}
            {commentsPerPage < lastCommentIndex && (

              <Button onClick={() => setCommentsPerPage(commentsPerPage + 2)}>Load More</Button>
            )}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCommentsModalClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
}


export default Profile;