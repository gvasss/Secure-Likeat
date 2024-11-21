import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spinner, Card, Container } from 'react-bootstrap';
import StarRating from '../pages/StarRating';

export default function CustomerReview() {

  const [reviews, setReviews] = useState([]);
  const userId = localStorage.getItem('userId');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCustomerReviews = async () => {
      try {
        const result = await axios.get(`http://localhost:8080/customer/${userId}/reviews`);
        setReviews(result.data);
        setLoading(false);
      } catch (error) {
        console.error("There was an error fetching the reviews!", error);
        setLoading(false);
      }
    };

    loadCustomerReviews();
  }, []);

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
        <div className="row row-cols-1 row-cols-md-1 g-4 mb-4">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div className="col" key={review.id}>
                <Card className="text-center mx-auto text card-hover" style={{ maxWidth: '700px' }} border="dark">
                  <Card.Body>
                    <h3 className="mb-4">Restaurant: {review.restaurantId.name}</h3>
                    <div className="mb-3">
                      <strong>Rating:</strong> <StarRating rating={review.rating} />
                    </div>
                    <Card.Text><strong>Description:</strong> {review.description}</Card.Text>
                    <Card.Text><strong>Date:</strong> {new Date(review.date).toLocaleDateString()}</Card.Text>
                  </Card.Body>
                </Card>
              </div>
            ))
          ) : (
            <div className="col">
              <div className="alert alert-warning" role="alert">
                No reviews found.
              </div>
            </div>
          )}
        </div>
    </Container>
  );
}