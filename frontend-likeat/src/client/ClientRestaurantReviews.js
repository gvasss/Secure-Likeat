import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Spinner, Card, Container, CloseButton } from 'react-bootstrap';
import StarRating from '../pages/StarRating';

export default function ClientRestaurantReviews() {

  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const result = await axios.get(`http://localhost:8080/restaurant/${id}/reviews`);
        setReviews(result.data);
        setLoading(false);
      } catch (error) {
        console.error("There was an error fetching the reviews!", error);
        setLoading(false);
      }
    };

    loadReviews();
  }, [id]);

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
      <i className="fas fa-star fa-3x"></i>
      <h3 className="text-center m-3 mb-4">My Reviews</h3>
      <div className="row row-cols-1 row-cols-md-1 g-4 mb-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div className="col" key={review.id}>
              <Card className="text-center mx-auto text card-hover" style={{ maxWidth: '700px' }} border="dark">
                <Card.Body>
                  <div className="mb-4">
                    <h3 className="card-title">Restaurant: {review.restaurantId.name}</h3>
                  </div>
                  <Card.Text><strong>Customer Name:</strong> {review.customerUserId.name}</Card.Text>
                  <Card.Text><strong>Description: </strong>{review.description}</Card.Text>
                  <div className="mb-3">
                    <strong>Rating:</strong> <StarRating rating={review.rating} />
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))
        ) : (
          <div className="alert alert-warning" role="alert">
            No reviews found for this restaurant.
          </div>
        )}
      </div>
    </Container>
  );
}
