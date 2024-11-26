import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';

export default function AddRestaurant() {
  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState(null);
  let navigate = useNavigate();

  const [restaurant, setRestaurant] = useState({
    clientUserId: Number(localStorage.getItem('userId')),
    name: '',
    address: '',
    style: '',
    cuisine: '',
    cost: '',
    information: '',
    phone: '',
    openingHours: '',
    location: '',
  });

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      setRestaurant((prevState) => ({
        ...prevState,
        clientUserId: userId,
      }));
    }
  }, []);

  const { clientUserId, name, address, style, cuisine, cost, information, phone, openingHours, location } = restaurant;

  const onInputChange = (e) => {
    setRestaurant({ ...restaurant, [e.target.name]: e.target.value });
  };

  const onMainImageChange = (e) => {
    setMainImage(e.target.files[0]);
  };

  const onAdditionalImagesChange = (e) => {
    setAdditionalImages([...e.target.files]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      const restaurantResponse = await axios.post('http://localhost:8080/restaurant', restaurant);

      const restaurantId = restaurantResponse.data.id;

      const formData = new FormData();
      formData.append('restaurantId', restaurantId);
      if (mainImage) formData.append('mainImage', mainImage, 'mainImage.jpg');
      additionalImages.forEach((image, index) => {
        formData.append('additionalImage', image, `additionalImage${index}.jpg`);
      });

      await axios.post(`http://localhost:8080/photos/restaurant/${restaurantId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/clientrestaurant');
    } catch (error) {
      console.error('Error submitting the form', error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data : error.message);
    }
  };

  return (
    <Container className="py-4">
      <i className="fas fa-utensils fa-3x"></i>
      <h3 className="text-center m-3 mb-4">Register Restaurant</h3>
      <div className="col-md-6 offset-md-3 rounded p-4">
        <Form noValidate validated={validated} onSubmit={onSubmit} encType="multipart/form-data">
          <Form.Floating className="mb-3">
            <Form.Control
              id="floatingClientUserId"
              type="text"
              placeholder="Client User ID"
              name="clientUserId"
              value={clientUserId}
              readOnly
            />
            <label htmlFor="floatingClientUserId">Client User ID</label>
          </Form.Floating>
          <Form.Floating className="mb-3">
            <Form.Control
              id="floatingName"
              type="text"
              placeholder="Enter the restaurant name"
              name="name"
              value={name}
              onChange={onInputChange}
              required
            />
            <label htmlFor="floatingName">Name</label>
            <Form.Control.Feedback type="invalid">
              Please enter a name.
            </Form.Control.Feedback>
          </Form.Floating>
          <Form.Floating className="mb-3">
            <Form.Control
              id="floatingAddress"
              type="text"
              placeholder="Enter the restaurant address"
              name="address"
              value={address}
              onChange={onInputChange}
              required
            />
            <label htmlFor="floatingAddress">Address</label>
            <Form.Control.Feedback type="invalid">
              Please enter an address.
            </Form.Control.Feedback>
          </Form.Floating>
          <Form.Floating className="mb-3">
            <Form.Control
              id="floatingStyle"
              type="text"
              placeholder="Enter the restaurant style"
              name="style"
              value={style}
              onChange={onInputChange}
              required
            />
            <label htmlFor="floatingStyle">Style</label>
            <Form.Control.Feedback type="invalid">
              Please enter a style.
            </Form.Control.Feedback>
          </Form.Floating>
          <Form.Floating className="mb-3">
            <Form.Control
              id="floatingCuisine"
              type="text"
              placeholder="Enter the cuisine type"
              name="cuisine"
              value={cuisine}
              onChange={onInputChange}
              required
            />
            <label htmlFor="floatingCuisine">Cuisine</label>
            <Form.Control.Feedback type="invalid">
              Please enter a cuisine.
            </Form.Control.Feedback>
          </Form.Floating>
          <Form.Floating className="mb-3">
            <Form.Control
              id="floatingCost"
              type="number"
              placeholder="Enter the cost"
              name="cost"
              min={1}
              max={5}
              value={cost}
              onChange={onInputChange}
              required
            />
            <label htmlFor="floatingCost">Cost</label>
            <Form.Control.Feedback type="invalid">
              Please enter a cost between 1 and 5.
            </Form.Control.Feedback>
          </Form.Floating>
          <Form.Floating className="mb-3">
            <Form.Control
              as="textarea"
              id="floatingInformation"
              placeholder="Enter your restaurant information"
              name="information"
              value={information}
              onChange={onInputChange}
              required
              style={{ height: '100px' }}
            />
            <label htmlFor="floatingInformation">Information</label>
            <Form.Control.Feedback type="invalid">
              Please enter some information.
            </Form.Control.Feedback>
          </Form.Floating>
          <Form.Floating className="mb-3">
            <Form.Control
              id="floatingPhone"
              type="text"
              placeholder="Enter the restaurant phone number"
              name="phone"
              value={phone}
              onChange={onInputChange}
              required
            />
            <label htmlFor="floatingPhone">Phone</label>
            <Form.Control.Feedback type="invalid">
              Please enter a phone number.
            </Form.Control.Feedback>
          </Form.Floating>
          <Form.Floating className="mb-3">
            <Form.Control
              id="floatingOpeningHours"
              type="text"
              placeholder="Enter the opening hours"
              name="openingHours"
              value={openingHours}
              onChange={onInputChange}
              required
            />
            <label htmlFor="floatingOpeningHours">Opening Hours</label>
            <Form.Control.Feedback type="invalid">
              Please enter the opening hours.
            </Form.Control.Feedback>
          </Form.Floating>
          <Form.Floating className="mb-3">
            <Form.Control
              id="floatingLocation"
              type="text"
              placeholder="Enter the restaurant location"
              name="location"
              value={location}
              onChange={onInputChange}
              required
            />
            <label htmlFor="floatingLocation">Location</label>
            <Form.Control.Feedback type="invalid">
              Please enter a location.
            </Form.Control.Feedback>
          </Form.Floating>
          <Form.Group controlId="formFileMain" className="mb-3">
            <Form.Label>Upload Main Image</Form.Label>
            <Form.Control type="file" name="mainImage" onChange={onMainImageChange} />
            <Form.Control.Feedback type="invalid">
              Please upload the main image.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formFileAdditional" className="mb-3">
            <Form.Label>Upload Additional Images</Form.Label>
            <Form.Control type="file" multiple name="additionalImages" onChange={onAdditionalImagesChange} />
          </Form.Group>
          {error && <p className="alert alert-danger">{error}</p>}
          <Button type="submit" className="btn btn-dark">
            Submit
          </Button>{' '}
          <Button variant="danger" onClick={() => window.history.back()}>
            Cancel
          </Button>
        </Form>
      </div>
    </Container>
  );
}
