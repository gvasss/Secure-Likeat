import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Carousel, Container, Card, CloseButton, Spinner } from 'react-bootstrap';

export default function ViewRestaurant() {

  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [userRole, setUserRole] = useState(null);
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

  const imageStyle = {
    width: '100%',
    height: '350px',
    objectFit: 'contain',
    backgroundColor: '#e4e6e8',
  };

  const handleSelect = (carouselIndex) => {
    setCarouselIndex(carouselIndex);
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
      <i className="fas fa-utensils fa-3x"></i>
      <h3 className="text-center m-3 mb-4">View Restaurant</h3>
      <div className="col-md-6 offset-md-3 rounded p-4">
        <Card className="text-center mx-auto text-white" border="dark">
          <Card.Body>
            <ul className="list-group list-group-flush">
              {userRole === 'admin' && (
                <>
                  <li className="list-group-item">
                    <b>ID: </b>{restaurant.id}
                  </li>
                </>
              )}
              <li className="list-group-item">
                <b>Client: </b>{restaurant.clientName}
              </li>
              <li className="list-group-item">
                <b>Name: </b>{restaurant.name}
              </li>
              <li className="list-group-item">
                <b>Address: </b>{restaurant.address}
              </li>
              <li className="list-group-item">
                <b>Style: </b>{restaurant.style}
              </li>
              <li className="list-group-item">
                <b>Cuisine: </b>{restaurant.cuisine}
              </li>
              <li className="list-group-item">
                <b>Cost: </b>{restaurant.cost}
              </li>
              <li className="list-group-item">
                <b>Information: </b>{restaurant.information}
              </li>
              <li className="list-group-item">
                <b>Phone: </b>{restaurant.phone}
              </li>
              <li className="list-group-item">
                <b>Opening Hours: </b>{restaurant.openingHours}
              </li>
              <li className="list-group-item">
                <b>Overall Rating: </b>{restaurant.overallRating}
              </li>
              <li className="list-group-item">
                <b>Reviews: </b>{restaurant.totalReviews}
              </li>
              <li className="list-group-item">
                <b>Location: </b>{restaurant.location}
              </li>
            </ul>
          </Card.Body>
        </Card>

        <div style={{ marginTop: '20px' }}>
          {restaurant.photo.length > 0 ? (
            <>
              <h5>{restaurant.photo[carouselIndex]?.isMain ? "Main Image" : "Additional Image"}</h5>
              <Carousel activeIndex={carouselIndex} onSelect={handleSelect} data-bs-theme="dark">
                {restaurant.photo.map((photo, index) => (
                  <Carousel.Item key={index}>
                    <img
                      className="d-block w-100 carousel-image"
                      src={`data:image/jpeg;base64,${photo.image}`}
                      alt={restaurant.name}
                      style={imageStyle}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            </>
          ) : (
            <div className="alert alert-warning" role="alert">
              <p>No photos available</p>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}