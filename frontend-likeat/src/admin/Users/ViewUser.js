import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CloseButton, Container, Card, Spinner } from 'react-bootstrap';

export default function ViewUser() {

  const { id } = useParams();
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const loadUser = async () => {
      try {
        const result = await axios.get(`http://localhost:8080/user/${id}/details`);
        setUser(result.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  const getIconClass = (role) => {
    switch (role) {
      case 'admin':
        return 'fas fa-user-shield fa-3x';
      case 'client':
        return 'fas fa-utensils fa-3x';
      case 'customer':
        return 'fas fa-user fa-3x';
      default:
        return 'fas fa-question-circle fa-3x';
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Container className="py-4 position-relative">
      <CloseButton variant="dark" className="close-btn" onClick={() => window.history.back()} aria-label="Close" />
      <i className={getIconClass(user.role)}></i>
      <h3 className="text-center m-3 mb-4">
        View {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
      </h3>
      <div className="col-md-6 offset-md-3 rounded p-4">
        <Card className="text-center mx-auto text-white mb-3" border="dark">
          <Card.Body>
          
            <ul className='list-group list-group-flush'>
              <li className='list-group-item'>
                <b>ID: </b> {user.id}
              </li>
              <li className='list-group-item'>
                <b>Username: </b> {user.username}
              </li>
              <li className='list-group-item'>
                <b>Name: </b> {user.name}
              </li>
              <li className='list-group-item'>
                <b>Surname: </b> {user.surname}
              </li>
              <li className='list-group-item'>
                <b>Email: </b> {user.email}
              </li>
              {user.role === 'customer' && (
                <>
                  <li className='list-group-item'>
                    <b>Location: </b> {user.location}
                  </li>
                  <li className='list-group-item'>
                    <b>Reviews: </b> {user.totalReviews}
                  </li>
                </>
              )}
            </ul>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}