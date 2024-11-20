import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';

const StarRating = ({ rating, onRatingChange }) => {
  const handleRatingChange = (newRating) => {
    onRatingChange(newRating);
  };

  return (
    <div className="star-rating">
      {[...Array(5)].map((star, index) => {
        const ratingValue = index + 1;
        return (
          <i
            key={index}
            className={`fas fa-star ${ratingValue <= rating ? 'checked' : ''}`}
            style={{ cursor: 'pointer', color: ratingValue <= rating ? '#ffc100' : '#ffffff' }}
            onClick={() => handleRatingChange(ratingValue)}
          ></i>
        );
      })}
    </div>
  );
};

export default function AddReview() {
  
  const { id } = useParams();
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState(null);
  let navigate = useNavigate();

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [review, setReview] = useState({
    customerUserId: Number(localStorage.getItem('userId')),
    restaurantId: Number(id),
    rating: 0,
    description: "",
    date: getCurrentDate(),
  });

  const { rating, description } = review;

  const onSubmit = async (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    if (!validateRating(rating)) {
      setError("Please enter a valid rating.");
      return;
    }

    try {
      await axios.post("http://localhost:8080/review", review);
      navigate("/restaurant/" + review.restaurantId);
    } catch (error) {
      console.error('There was an error submitting the review:', error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data : error.message);
    }
  };

  const validateRating = (rating) => {
    return rating >= 1 && rating <= 5;
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setReview({ ...review, [name]: value });
  };

  const handleRatingChange = (newRating) => {
    if (newRating >= 1 && newRating <= 5) {
      setReview({ ...review, rating: newRating });
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2">
          <h2 className="text-center m-4">Add Review</h2>

          <Form noValidate validated={validated} onSubmit={onSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Rating</Form.Label>
              <StarRating rating={rating} onRatingChange={handleRatingChange} />
              <Form.Control.Feedback type="invalid">
                Please select a rating.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Floating className="mb-3">
              <Form.Control
                as="textarea"
                id="floatingDescription"
                placeholder="Enter your description"
                name="description"
                value={description}
                onChange={onInputChange}
                required
                style={{ height: '100px' }}
              />
              <label htmlFor="floatingDescription">Description</label>
              <Form.Control.Feedback type="invalid">
                Please enter a description.
              </Form.Control.Feedback>    
            </Form.Floating>
            {error && <p className="alert alert-danger">{error}</p>}
            <Button variant="danger" onClick={() => window.history.back()}>Cancel</Button>{' '}
            <Button type="submit" className="btn btn-dark">Submit</Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
