import { useEffect, useState } from 'react';
import { Spinner, Card, Container, Form, Button, Modal } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { getClientRestaurants, deleteRestaurant } from '../../../services/restaurants';

export default function ClientRestaurant() {
  const [restaurants, setRestaurants] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [restaurantToDelete, setRestaurantToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClientRestaurants();
  }, []);

  const fetchClientRestaurants = async () => {
    try {
      const restaurantData = await getClientRestaurants();
      setRestaurants(restaurantData);
      setLoading(false);
    } catch (error) {
      setError("Failed to load restaurants");
      console.error("There was an error fetching the restaurants!", error);
      setLoading(false);
    }
  };

  const handleViewReviews = (id) => {
    navigate(`/restaurant/${id}/reviews`);
  };

  const handleDeleteRestaurant = async (id) => {
    try {
      await deleteRestaurant(id);
      setRestaurants((restaurants) => restaurants.filter(restaurant => restaurant.id !== id));
      setShowModal(false);
    } catch (error) {
      console.error("There was an error deleting the restaurant!", error);
    }
  };

  const handleDeleteClick = (id) => {
    setRestaurantToDelete(id);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setRestaurantToDelete(null);
  };

  const handleModalConfirm = () => {
    if (restaurantToDelete) {
      handleDeleteRestaurant(restaurantToDelete);
    }
  };

  // Search function
  const filteredRestaurants = restaurants.filter(restaurant => {
    const nameMatch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase());
    const locationMatch = restaurant.location.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || locationMatch;
  });

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
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
      <Form className="mb-4" onSubmit={handleSearchSubmit}>
        <Form.Control
          type="search" 
          placeholder="Search by Name or Location" 
          aria-label="Search"
          value={searchQuery}
          onChange={handleSearch}
        />
      </Form>
      <div className="row row-cols-1 row-cols-md-1 g-4 mb-4">
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((restaurant) => (
            <div className="col" key={restaurant.id}>
              <Card 
                className={`text-center mx-auto text card-hover ${restaurant.status === 'accepted' ? 'border-success' : ''}`} 
                style={{ maxWidth: '700px' }} 
                border="dark"
              >
                <Card.Body>
                  <div className="mb-4">
                    <h3 className="card-title">Restaurant: {restaurant.name}</h3>
                  </div>
                  <Card.Text><strong>Location:</strong> {restaurant.location}</Card.Text>
                  <Card.Text><strong>Status:</strong> {restaurant.status}</Card.Text>
                  <Button variant="primary" onClick={() => handleViewReviews(restaurant.id)}><i className="fas fa-star"></i> Reviews</Button>{" "}
                  <Link className="btn btn-secondary mx-2" to={`/viewrestaurant/${restaurant.id}`}><i className="fas fa-eye"></i> View</Link>
                  <Link className="btn btn-dark mx-2" to={`/editrestaurant/${restaurant.id}`}><i className="fas fa-edit"></i> Edit</Link>
                  <Button className="btn btn-danger mx-2" onClick={() => handleDeleteClick(restaurant.id)}><i className="fas fa-trash-alt"></i> Delete</Button>
                </Card.Body>
              </Card>
            </div>
          ))
        ) : (
          <div className="col">
            <div className="alert alert-warning" role="alert">
              No restaurants found for this client.
            </div>
          </div>
        )}
      </div>
      <Link className="btn btn-dark" to="/addrestaurant/">
        Add Restaurant
      </Link>
      {error && <p className="alert alert-danger">{error}</p>}

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this restaurant?</Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleModalConfirm}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}