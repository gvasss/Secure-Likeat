import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, Table, Button, Spinner, Pagination } from 'react-bootstrap';

export default function AdminRestaurant() {

  const [restaurants, setRestaurants] = useState([]);
  const [reviews, setReviews] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [restaurantsPerPage] = useState(10);

  useEffect(() => {
    loadRestaurants();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const loadRestaurants = async () => {
    try {
      const result = await axios.get("http://localhost:8080/restaurants");
      const fetchedRestaurants = result.data;
      setRestaurants(fetchedRestaurants);

      // Fetch reviews for each restaurant
      const reviewsPromises = fetchedRestaurants.map(restaurant =>
        axios.get(`http://localhost:8080/restaurant/${restaurant.id}/reviews`)
      );
      const reviewsResults = await Promise.all(reviewsPromises);
      const reviewsData = {};
      reviewsResults.forEach((reviewResult, index) => {
        reviewsData[fetchedRestaurants[index].id] = reviewResult.data;
      });
      setReviews(reviewsData);
      setLoading(false);
    } catch (error) {
      console.error("There was an error fetching the restaurants!", error);
      setLoading(false);
    }
  };

  const deleteRestaurant = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/restaurant/${id}`);
      setRestaurants(restaurants.filter(restaurant => restaurant.id !== id));
    } catch (error) {
      console.error("There was an error deleting the restaurant!", error);
    }
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  // Search
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

  // Pagination logic
  const indexOfLastRestaurant = currentPage * restaurantsPerPage;
  const indexOfFirstRestaurant = indexOfLastRestaurant - restaurantsPerPage;
  const currentRestaurants = filteredRestaurants.slice(indexOfFirstRestaurant, indexOfLastRestaurant);

  const totalPages = Math.ceil(filteredRestaurants.length / restaurantsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

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
    <Container>
      <Row className="py-4">
        <Col>
          <Form className="mb-3" onSubmit={handleSearchSubmit}>
            <Form.Control
              type="search"
              placeholder="Search by Name and Location"
              aria-label="Search"
              value={searchQuery}
              onChange={handleSearch}
            />
          </Form>

          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Id</th>
                <th>Client</th>
                <th>Name</th>
                <th>Style</th>
                <th>Location</th>
                <th>Cost</th>
                <th>Reviews</th>
                <th>Overall Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRestaurants.map((restaurant, index) => (
                <tr key={restaurant.id}>
                  <td>{indexOfFirstRestaurant + index + 1}</td>
                  <td>{restaurant.id}</td>
                  <td>{restaurant.clientUserId ? restaurant.clientUserId.username : 'N/A'}</td>
                  <td>{restaurant.name}</td>
                  <td>{restaurant.style}</td>
                  <td>{restaurant.location}</td>
                  <td>{restaurant.cost}</td>
                  <td>{reviews[restaurant.id] ? reviews[restaurant.id].length : 0}</td>
                  <td>{calculateAverageRating(reviews[restaurant.id])}</td>
                  <td>
                    <Link className="btn btn-dark mx-2" to={`/viewrestaurant/${restaurant.id}`}>
                      <i className="fas fa-eye"></i> View
                    </Link>
                    <Button variant="danger" className="mx-2" onClick={() => deleteRestaurant(restaurant.id)}>
                      <i className="fas fa-trash-alt"></i> Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {totalPages > 1 && (
            <Pagination className="justify-content-center pagination-dark">
              {[...Array(totalPages).keys()].map(number => (
                <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => handlePageChange(number + 1)}>
                  {number + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          )}
        </Col>
      </Row>
    </Container>
  );
}
