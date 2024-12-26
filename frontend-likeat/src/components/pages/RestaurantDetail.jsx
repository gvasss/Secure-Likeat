/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import StarRating from '../../layout/StarRating';
import '../../layout/Restaurant.css';
import { Container, Card, ListGroup, Spinner, Carousel, Row, Col } from 'react-bootstrap';
import { getRestaurant } from '../../services/restaurants';
import { useAuth } from '../../context/AuthContext'

const RestaurantDetail = () => {
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
    reviews: [],
    overallRating: 0,
    totalReviews: 0,
    mainPhoto: null,
    additionalPhotos: []
  });
  const [photos, setPhotos] = useState([]);

  const Auth = useAuth();
  const user = Auth.user;

  const [carouselIndex, setCarouselIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    fetchRestaurant();
  }, []);

  const fetchRestaurant = async () => {
    try {
      const restaurantData = await getRestaurant(id);

      const combinedPhotos = [];
      if (restaurantData.mainPhoto) {
        combinedPhotos.push(restaurantData.mainPhoto);
      }
      if (restaurantData.additionalPhotos && restaurantData.additionalPhotos.length > 0) {
        combinedPhotos.push(...restaurantData.additionalPhotos);
      }

      setRestaurant(restaurantData);
      setPhotos(combinedPhotos);
      setLoading(false);
    } catch (error) {
      setError('Failed to load restaurant data.');
      console.error("There was an error fetching the restaurant details!", error);
      setLoading(false);
    }
  };

  const handleSelect = (selectedIndex) => {
    setCarouselIndex(selectedIndex);
  };

  const generateGoogleMapsEmbedUrl = (address) => {
    const encodedAddress = encodeURIComponent(address);
    return `https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=${encodedAddress}`;
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
      {error && <p className="alert alert-danger">{error}</p>}
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
        {photos.length > 0 ? (
          <Carousel activeIndex={carouselIndex} onSelect={handleSelect} data-bs-theme="dark">
            {photos.map((photo, index) => (
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
        restaurant.reviews.map((review, index) => (
          <Card key={`review-${review.id}-${index}`} className="mb-3">
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
      {user.roles === 'CUSTOMER' && (
        <Link className="btn btn-dark" to={`/addreview/${id}`}>Add Review</Link>
      )}
    </Container>
  );
}

export default RestaurantDetail;