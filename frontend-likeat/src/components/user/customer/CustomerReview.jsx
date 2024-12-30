import { useEffect, useState } from 'react';
import { Spinner, Card, Container } from 'react-bootstrap';
import StarRating from '../../../layout/StarRating';
import { getCustomerReviews } from '../../../services/reviews';

const CustomerReview = () =>{
  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const reviewData = await getCustomerReviews();
      setReviews(reviewData);
      setLoading(false);
    } catch (error) {
      setError('Failed to load reviews.');
      console.error("There was an error fetching the reviews!", error);
      setLoading(false);
    }
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
      <div className="row row-cols-1 row-cols-md-1 g-4 mb-4">
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div className="col" key={`review-${review.id}-${index}`}>
              <Card className="text-center mx-auto text card-hover" style={{ maxWidth: '700px' }} border="dark">
                <Card.Body>
                  <h3 className="mb-4">Restaurant: {review.restaurantName}</h3>
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

export default CustomerReview;