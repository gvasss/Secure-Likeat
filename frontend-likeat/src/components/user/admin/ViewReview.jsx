import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CloseButton, Container, Card, Spinner } from 'react-bootstrap';
import { getReviewById } from '../../../services/reviews';

const ViewReview = () => {
  const {id} = useParams();

  const [review, setReview] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const reviewData = await getReviewById(id);
        setReview(reviewData);
        setLoading(false);
      } catch (error) {
        setError('Error fetching reviews');
        console.error('Error fetching reviews:', error);
        setLoading(false);
      }
    };

    fetchReview()
  },[id]);

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
      <h3 className="text-center m-3 mb-4">View Review</h3>
      <div className="col-md-6 offset-md-3 rounded p-4">
        <Card className="text-center mx-auto text-white mb-3" border="dark">
          <Card.Body>
            <ul className='list-group list-group-flush'>
              <li className='list-group-item'>
                <b>ID: </b>
                {review.id}
              </li>
              <li className='list-group-item'>
                <b>Rating: </b>
                {review.rating}
              </li>
              <li className='list-group-item'>
                <b>Description: </b>
                {review.description}
              </li>
              <li className='list-group-item'>
                <b>Date: </b>
                {review.date}
              </li>
              <li className='list-group-item'>
                <b>Customer: </b>
                {review.customerName}
              </li>
              <li className='list-group-item'>
                <b>Restaurant: </b>
                {review.restaurantName}
              </li>
            </ul>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

export default ViewReview;