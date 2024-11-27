import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CloseButton, Container, Card } from 'react-bootstrap';

export default function ViewReview() {

    const [review, setReview] = useState( {
      id: "",
      rating: "",
      description: "",
      date: "",
      customerUserId: "",
      restaurantId: "",
    });

    const {id} = useParams();

    useEffect(() => {
      const loadReview = async () => {
        const result = await axios.get (`http://localhost:8080/review/${id}`)
        setReview(result.data)
      };

      loadReview()
    },[id]);
 
  return (
    <Container className="py-4 position-relative">
      <CloseButton variant="dark" className="close-btn" onClick={() => window.history.back()} aria-label="Close" />
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
                <b>Customer Id: </b>
                {review.customerUserId.id}
              </li>
              <li className='list-group-item'>
                <b>Customer: </b>
                {review.customerUserId.username}
              </li>
              <li className='list-group-item'>
                <b>Restaurant Id: </b>
                {review.restaurantId.id}
              </li>
              <li className='list-group-item'>
                <b>Restaurant: </b>
                {review.restaurantId.name}
              </li>
            </ul>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}
