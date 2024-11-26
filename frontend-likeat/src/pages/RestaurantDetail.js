import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import StarRating from './StarRating';
import './Restaurant.css';
import { Container, Card, ListGroup, Spinner, Carousel, Row, Col } from 'react-bootstrap';

export default function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRestaurant = async () => {
      try {
        const result = await axios.get(`http://localhost:8080/restaurant/${id}/details`);
        setRestaurant(result.data);
        setLoading(false);
      } catch (error) {
        console.error("There was an error fetching the restaurant details!", error);
        setLoading(false);
      }
    };

    const userRole = localStorage.getItem('userRole');
    setUserRole(userRole);
    loadRestaurant();
  }, [id]);

  const handleSelect = (selectedIndex) => {
    setCarouselIndex(selectedIndex);
  };

  if (!restaurant) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  //const key = process.env.API_KEY;
  const generateGoogleMapsEmbedUrl = (address) => {
    const encodedAddress = encodeURIComponent(address);
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyAG-SZyG6mMrfhGHJPcc1y8mCFCYd3FWpU&q=${encodedAddress}`;
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
    <Container className='py-4'>
      <Card.Body>
        <Row>
          <div>
            <Card.Title className="display-4">{restaurant.name}</Card.Title>
            <div className="mb-4">
              <StarRating rating={restaurant.overallRating} />
              <p>{restaurant.overallRating}</p>
            </div>
          </div>
        </Row>
      </Card.Body>

      <Card.Body className="mb-4">
        {restaurant.photo.length > 0 ? (
          <Carousel activeIndex={carouselIndex} onSelect={handleSelect} data-bs-theme="dark">
            {restaurant.photo.map((photo, index) => (
              <Carousel.Item key={index}>
                <img
                  className="d-block w-100 carousel-image"
                  src={`data:image/jpeg;base64,${photo.image}`}
                  alt={restaurant.name}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        ) : (
          <div className="alert alert-warning" role="alert">
            <p>No photos available</p>
          </div>
        )}
      </Card.Body>

      <h3 className="mb-4">Information</h3>
      <Card className="text-center mx-auto mb-4" border="dark">
        <Card.Body>
          <Card.Text><i className="fas fa-info-circle"></i> {restaurant.information}</Card.Text>
          <Card.Text><i className="fas fa-map-marker-alt"></i> <strong>Address:</strong> {restaurant.address}</Card.Text>
          <Card.Text><i className="fas fa-clock"></i> <strong>Opening hours:</strong> {restaurant.openingHours}</Card.Text>
          <Card.Text><i className="fas fa-phone"></i> <strong>Phone:</strong> {restaurant.phone}</Card.Text>
          <Card.Text><i className="fas fa-utensils"></i> <strong>Style:</strong> {restaurant.style}</Card.Text>
          <Card.Text><i className="fas fa-euro-sign"></i> <strong>Cost:</strong> {'€'.repeat(restaurant.cost)}</Card.Text>
        </Card.Body>
      </Card>

      <ListGroup.Item className="mb-4">
        <div style={{ height: '400px', width: '100%' }}>
          <iframe
            title={`Map of ${restaurant.name}`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            src={generateGoogleMapsEmbedUrl(restaurant.address)}
            allowFullScreen
          ></iframe>
        </div>
      </ListGroup.Item>

      <h3 className="mb-4">Reviews</h3>
      {restaurant.reviews.length > 0 ? (
        restaurant.reviews.map(review => (
          <Card key={review.restaurantId} className="mb-3" border="dark">
            <Card.Body>
              <Row className="justify-content-md-center">
              <Col sm={1}>
                  <i className="fas fa-user-circle fa-2x"></i>
                  <div className="reviewer-name">{review.customerName}</div>
                </Col>
                <Col sm={10}>
                  <StarRating rating={review.rating} />
                  <Card.Text>{review.description}</Card.Text>
                  <Card.Subtitle>{new Date(review.date).toLocaleDateString()}</Card.Subtitle>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))
      ) : (
        <div className="alert alert-warning" role="alert">
          No reviews found for this restaurant.
        </div>
      )}
      {userRole === 'customer' && (
        <Link className="btn btn-dark" to={`/addreview/${restaurant.id}`}>Add Review</Link>
      )}
    </Container>
  );
}