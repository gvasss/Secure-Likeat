import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Carousel, Container, Card, CloseButton } from 'react-bootstrap';

export default function ViewRestaurant() {

  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [previousImages, setPreviousImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const userRole = localStorage.getItem('userRole');

  const [restaurant, setRestaurant] = useState({
    id: "",
    clientUserId: "",
    name: "",
    address: "",
    style: "",
    cuisine: "",
    cost: "",
    information: "",
    phone: "",
    openingHours: "",
    overallRating: "",
    reviews: "",
    location: "",
  });

  useEffect(() => {
    loadRestaurant();
    loadReviews();
    loadImages();
  }, []);

  const loadRestaurant = async () => {
    const result = await axios.get(`http://localhost:8080/restaurant/${id}`);
    setRestaurant(result.data);
  };

  const loadReviews = async () => {
    try {
      const result = await axios.get(`http://localhost:8080/restaurant/${id}/reviews`);
      setReviews(result.data);
    } catch (error) {
      console.error("There was an error fetching the reviews!", error);
    }
  };

  const loadImages = async () => {
    try {
      const result = await axios.get(`http://localhost:8080/photos/restaurant/${id}`);
      setPreviousImages(result.data);
    } catch (error) {
      console.error("Error loading images", error);
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  const imageStyle = {
    width: '100%',
    height: '350px',
    objectFit: 'contain',
    backgroundColor: '#e4e6e8',
  };

  const handleSelect = (selectedIndex) => {
    setCurrentImageIndex(selectedIndex);
  };

  return (
    <Container className="py-4 position-relative">
      <CloseButton variant="dark" className="close-btn" onClick={() => window.history.back()} aria-label="Close" />
      <i className="fas fa-utensils fa-3x"></i>
      <h3 className="text-center m-3 mb-4">View Restaurant</h3>
      <div className="col-md-6 offset-md-3 rounded p-4">
        <Card className="text-center mx-auto text-white" border="dark">
          <Card.Body>
            <ul className="list-group list-group-flush">
              {userRole === 'admin' && (
                <>
                  <li className="list-group-item">
                    <b>ID: </b>{restaurant.id}
                  </li>
                </>
              )}
              <li className="list-group-item">
                <b>Client: </b>{restaurant.clientUserId.username}
              </li>
              <li className="list-group-item">
                <b>Name: </b>{restaurant.name}
              </li>
              <li className="list-group-item">
                <b>Address: </b>{restaurant.address}
              </li>
              <li className="list-group-item">
                <b>Style: </b>{restaurant.style}
              </li>
              <li className="list-group-item">
                <b>Cuisine: </b>{restaurant.cuisine}
              </li>
              <li className="list-group-item">
                <b>Cost: </b>{restaurant.cost}
              </li>
              <li className="list-group-item">
                <b>Information: </b>{restaurant.information}
              </li>
              <li className="list-group-item">
                <b>Phone: </b>{restaurant.phone}
              </li>
              <li className="list-group-item">
                <b>Opening Hours: </b>{restaurant.openingHours}
              </li>
              <li className="list-group-item">
                <b>Overall Rating: </b>{calculateAverageRating()}
              </li>
              <li className="list-group-item">
                <b>Reviews: </b>{reviews.length}
              </li>
              <li className="list-group-item">
                <b>Location: </b>{restaurant.location}
              </li>
            </ul>
          </Card.Body>
        </Card>

        <div style={{ marginTop: '20px' }}>
          <h5>{previousImages[currentImageIndex]?.isMain ? "Main Image" : "Additional Images"}</h5>
          {previousImages.length > 0 ? (
            <Carousel activeIndex={currentImageIndex} onSelect={handleSelect} data-bs-theme="dark" className="mb-3">
              {previousImages.map((image, index) => (
                <Carousel.Item key={index}>
                  <img
                    className="d-block w-100"
                    src={`data:image/jpeg;base64,${image.image}`}
                    alt={`Image ${index}`}
                    style={imageStyle}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          ) : (
            <div className="alert alert-warning" role="alert">
              <p>No images available</p>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
