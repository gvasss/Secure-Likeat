import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

export default function EditReview() {

  let navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState(null);

  const [review, setReview] = useState({
    rating: "",
    description: "",
    date: "",
    customerUserId: "",
    restaurantId: "",
  });

  const [validated, setValidated] = useState(false);

  const { rating, description, date, customerUserId, restaurantId } = review;

  const onInputChange = (e) => {
    setReview({ ...review, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    loadReview();
  }, []);

  const onSubmit = async (e) => {
    try{
      const form = e.currentTarget;
      e.preventDefault();
      if (form.checkValidity() === false) {
        e.stopPropagation();
        setValidated(true);
        return;
      }
      await axios.put(`http://localhost:8080/review/${id}`, review);
      navigate("/adminreview");
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message); 
      setError('Invalid username or password.');
    }
    
  };

  const loadReview = async () => {
    const result = await axios.get(`http://localhost:8080/review/${id}`);
    setReview(result.data);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2">
          <h2 className="text-center m-4">Edit Review</h2>

          <Form noValidate validated={validated} onSubmit={onSubmit}>
            <Form.Floating className="mb-3">
              <Form.Control
                id="floatingRating"
                type="number"
                placeholder="Enter your rating"
                name="rating"
                value={rating}
                onChange={onInputChange}
                required
                min={1}
                max={5}
              />
              <label htmlFor="floatingRating">Rating</label>
              <Form.Control.Feedback type="invalid">
                Please enter a rating between 1 and 5.
              </Form.Control.Feedback>
            </Form.Floating>
            <Form.Floating className="mb-3">
              <Form.Control
                id="floatingDescription"
                type="text"
                placeholder="Enter your description"
                name="description"
                value={description}
                onChange={onInputChange}
                required
              />
              <label htmlFor="floatingDescription">Description</label>
              <Form.Control.Feedback type="invalid">
                Please enter a description.
              </Form.Control.Feedback>
            </Form.Floating>
            <Form.Floating className="mb-3">
              <Form.Control
                id="floatingDate"
                type="date"
                placeholder="Enter the date"
                name="date"
                value={date}
                onChange={onInputChange}
                required
              />
              <label htmlFor="floatingDate">Date</label>
              <Form.Control.Feedback type="invalid">
                Please enter a date.
              </Form.Control.Feedback>
            </Form.Floating>
            <Form.Floating className="mb-3">
              <Form.Control
                id="floatingCustomerUserId"
                type="text"
                placeholder="Enter your customerUserId"
                name="customerUserId"
                value={customerUserId}
                onChange={onInputChange}
                required
              />
              <label htmlFor="floatingCustomerUserId">Customer User ID</label>
              <Form.Control.Feedback type="invalid">
                Please enter a valid customer user ID.
              </Form.Control.Feedback>
            </Form.Floating>
            <Form.Floating className="mb-3">
              <Form.Control
                id="floatingRestaurantId"
                type="text"
                placeholder="Enter your restaurantId"
                name="restaurantId"
                value={restaurantId}
                onChange={onInputChange}
                required
              />
              <label htmlFor="floatingRestaurantId">Restaurant ID</label>
              <Form.Control.Feedback type="invalid">
                Please enter a valid restaurant ID.
              </Form.Control.Feedback>
            </Form.Floating>
            <Button type="submit" className="btn btn-dark">Submit</Button>{' '}
            <Button variant="danger" onClick={() => window.history.back()}>Cancel</Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
