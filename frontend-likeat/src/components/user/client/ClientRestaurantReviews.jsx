import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner, Card, Container, CloseButton } from 'react-bootstrap';
import StarRating from '../../../layout/StarRating';
import { getRestaurantReviews } from '../../../services/reviews';

const ClientRestaurantReviews = () => {
  const { id } = useParams();

  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewData = await getRestaurantReviews(id);
        setReviews(reviewData);
        setLoading(false);
      } catch (error) {
        setError("Error fetchig reviews")
        console.error("There was an error fetching the reviews!", error);
        setLoading(false);
      }
    };

    fetchReviews();
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
      {error && <p className="alert alert-danger">{error}</p>}
      <CloseButton className="close-btn" onClick={() => window.history.back()} aria-label="Close" />
      <i className="fas fa-star fa-3x"></i>
      <h3 className="text-center m-3 mb-4">Reviews</h3>
      <div className="row row-cols-1 row-cols-md-1 g-4 mb-4">
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div className="col" key={`review-${review.id}-${index}`}>
              <Card className="text-center mx-auto text card-hover" style={{ maxWidth: '700px' }} border="dark">
                <Card.Body>
                  <div className="mb-4">
                    <h3 className="card-title">Restaurant: {review.restaurantName}</h3>
                  </div>
                  <Card.Text><strong>Customer Name:</strong> {review.customerName}</Card.Text>
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

export default ClientRestaurantReviews;