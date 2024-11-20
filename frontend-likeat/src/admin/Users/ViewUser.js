import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CloseButton, Container, Card } from 'react-bootstrap';

export default function ViewUser() {

  const { id } = useParams();
  const [error, setError] = useState(null);
  const [reviewCount, setReviewCount] = useState(0);

  const [user, setUser] = useState({
    id: "",
    username: "",
    name: "",
    surname: "",
    email: "",
    role: "",
    reviews: "",
    location: "",
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const result = await axios.get(`http://localhost:8080/user/${id}`);
      const userRole = result.data.role;
      await loadUserDetails(userRole);
    } catch (err) {
      setError('Failed to load user role.');
      console.error(err);
    }
  };

  const loadUserDetails = async (role) => {
    try {
      const endpoint = getEndpoint(role, id);
      const result = await axios.get(endpoint);
      setUser(result.data);

      if (role === 'customer') {
        const reviewsResult = await axios.get(`http://localhost:8080/customer/${id}/reviews`);
        setReviewCount(reviewsResult.data.length);
      }
    } catch (err) {
      setError('Failed to load user details.');
      console.error(err);
    }
  };

  const getEndpoint = (role, id) => {
    switch (role) {
      case 'admin':
        return `http://localhost:8080/admin/${id}`;
      case 'client':
        return `http://localhost:8080/client/${id}`;
      case 'customer':
        return `http://localhost:8080/customer/${id}`;
      default:
        throw new Error('Unknown user role');
    }
  };

  if (error) return <p>{error}</p>;

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
                    <b>Reviews: </b> {reviewCount}
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
