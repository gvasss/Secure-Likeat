import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, Spinner, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import StarRating from './StarRating';

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [reviewsSummary, setReviewsSummary] = useState({});
  const [photos, setPhotos] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({
    locations: [],
    styles: [],
    cuisines: [],
    costs: []
  });
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole') || '';
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  useEffect(() => {
    const loadRestaurants = async () => {

      try {
        const restaurants = await axios.get(`http://localhost:8080/restaurants/home`);
        setRestaurants(restaurants.data);
        setLoading(false);
      } catch (error) {
        console.error('There was an error fetching the restaurants!', error);
        setLoading(false);
      }
    };

    loadRestaurants();
  }, []);

  const handleRestaurantClick = (id) => {
    if (userRole) {
      navigate(`/restaurant/${id}`);
    } else {
      setShowLoginPopup(true);
      setTimeout(() => {
        setShowLoginPopup(false);
      }, 3000);
    }
  };

  const filteredRestaurants = () =>restaurants.filter((restaurant) => {
    const nameMatch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase());
    const locationMatch = selectedFilters.locations.length === 0 || selectedFilters.locations.includes(restaurant.location);
    const styleMatch = selectedFilters.styles.length === 0 || selectedFilters.styles.includes(restaurant.style);
    const cuisineMatch = selectedFilters.cuisines.length === 0 || selectedFilters.cuisines.includes(restaurant.cuisine);
    const costMatch = selectedFilters.costs.length === 0 || selectedFilters.costs.includes(restaurant.cost);
    return nameMatch && locationMatch && styleMatch && cuisineMatch && costMatch;
  });

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const getMainPhoto = (restaurant) => {
    if (restaurant.photo.length === 0) {
      return 'https://cdn.otstatic.com/legacy-cw/default2-original.png';
    }
    const restaurantPhotos = restaurant.photo[0].image;
    if (!restaurantPhotos || restaurantPhotos.length === 0) {
      return 'https://cdn.otstatic.com/legacy-cw/default2-original.png';
    }
    if (restaurantPhotos) {
      return `data:image/jpeg;base64,${restaurantPhotos}`;
    }
  };

  return (
    <Container className="custom-container">
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
              {Array.isArray(restaurants) && restaurants.map((restaurant) => (
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