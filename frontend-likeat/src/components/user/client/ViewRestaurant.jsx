/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Carousel, Container, Card, CloseButton, Spinner } from 'react-bootstrap';
import { getRestaurant } from '../../../services/restaurants';

const ViewRestaurant = () => {
  const { id } = useParams();

  const [restaurant, setRestaurant] = useState({
    name: "",
    address: "",
    style: "",
    cuisine: "",
    cost: "",
    information: "",
    phone: "",
    openingHours: "",
    location: "",
    mainPhoto: null,
    additionalPhotos: []
});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRestaurant();
  }, []);

  const fetchRestaurant = async () => {
    try {
      const restautantData = await getRestaurant(id);
      setRestaurant(restautantData);
      setLoading(false);
    } catch {
      setError('Failed to load restaurant data.');
      setLoading(false);
    }
  };

  const imageStyle = {
    width: '100%',
    height: '350px',
    objectFit: 'contain',
    backgroundColor: '#e4e6e8',
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
      {error && <p className="alert alert-danger">{error}</p>}
      <CloseButton className="close-btn" onClick={() => window.history.back()} aria-label="Close" />
      <i className="fas fa-utensils fa-3x"></i>
      <h3 className="text-center m-3 mb-4">View Restaurant</h3>
      <div className="col-md-6 offset-md-3 rounded p-4">
        <Card className="text-center mx-auto text-white" border="dark">
          <Card.Body>
            <ul className="list-group list-group-flush">
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

        <div className="mb-3"></div>
        <div className="mb-3">
          {(restaurant.mainPhoto || restaurant.additionalPhotos.length > 0) ? (
            <Carousel>
              {restaurant.mainPhoto && (
                <Carousel.Item key={restaurant.mainPhoto.id}>
                  <h5 className="text-center mb-2">Main Image</h5>
                  <img
                      src={`data:image/jpeg;base64,${restaurant.mainPhoto.image}`}
                      alt="Main Restaurant"
                      style={imageStyle}
                  />
                </Carousel.Item>
              )}
              {restaurant.additionalPhotos.map((photo, index) => (
                <Carousel.Item key={photo.id}>
                  <h5 className="text-center mb-2">Additional Image</h5>
                  <img
                      src={`data:image/jpeg;base64,${photo.image}`}
                      alt={`Additional ${index + 1}`}
                      style={imageStyle}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          ) : (
            <div className="alert alert-warning" role="alert">
              <p>No images available</p>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}

export default ViewRestaurant;