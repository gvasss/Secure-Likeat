import { useEffect, useState } from 'react';
import { Container, Card, Spinner, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import StarRating from '../../layout/StarRating';
import { getAllRestaurants } from '../../services/restaurants'

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);

  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const restautantData = await getAllRestaurants()
      setRestaurants(restautantData)
      setLoading(false)
    } catch (error) {
      setError('Failed to load restaurant data.')
      console.error('There was an error fetching the restaurants!', error)
      setLoading(false)
    }
  };

  const handleRestaurantClick = (id) => {
    try {
      navigate(`/restaurant/${id}`);
    } catch (error) {
      setShowLoginPopup(true);
      setTimeout(() => {
        setShowLoginPopup(false);
      }, 3000);
      console.error('Failed to navigate to the restaurant page', error)
    }
  };

  const filteredRestaurants = Array.isArray(restaurants)
  ? restaurants.filter((restaurant) => {
      const nameMatch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase());
      return nameMatch;
    })
  : [];

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const getMainPhoto = (restaurant) => {
    if (!restaurant.mainPhoto) {
      return 'https://cdn.otstatic.com/legacy-cw/default2-original.png';
    }
    const restaurantPhotos = restaurant.mainPhoto.image;
    if (!restaurantPhotos) {
      return 'https://cdn.otstatic.com/legacy-cw/default2-original.png';
    }
    if (restaurantPhotos) {
      return `data:image/jpeg;base64,${restaurantPhotos}`;
    }
  };

  return (
    <Container className="custom-container">
      {error && <p className="alert alert-danger">{error}</p>}
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          <Form className="mb-4" onSubmit={handleSearchSubmit}>
            <Form.Control
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={searchQuery}
              onChange={handleSearch}
            />

          </Form>
            <Row xs={1} md={4} className="g-4">
              {filteredRestaurants.map((restaurant) => (
                <Col key={restaurant.id}>
                  <Card className="card-hover" onClick={() => handleRestaurantClick(restaurant.id)} style={{ cursor: 'pointer' }}>
                    <Card.Img
                      variant="top"
                      src={getMainPhoto(restaurant)}
                      alt={restaurant.name}
                    />
                    <Card.Body>
                      <h4 className="text-center m-3 mb-4">{restaurant.name}</h4>
                      <Card.Text>
                        {restaurant.location} | {restaurant.cuisine} | {restaurant.style} | {'€'.repeat(restaurant.cost)}
                      </Card.Text>
                      <div className="d-flex justify-content-between align-items-center">
                        <StarRating rating={restaurant.overallRating || 0} />
                        <span>{restaurant.totalReviews || 0} reviews</span>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

          {showLoginPopup && (
            <div className="login-popup">
              Please sign in to view restaurant details.
            </div>
          )}

        </>
      )}
    </Container>
  );
}

export default Home;