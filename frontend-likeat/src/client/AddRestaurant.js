import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';
import PlacesPicker from '@tasiodev/react-places-autocomplete';

export default function AddRestaurant() {
  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState(null);
  const [addressError, setAddressError] = useState(false);
  let navigate = useNavigate();
  const [value, setValue] = useState(null);
  const [formattedAddress, setFormattedAddress] = useState('');

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

  const { clientUserId, name, style, cuisine, cost, information, phone, openingHours, location } = restaurant;

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
    const form = e.currentTarget;
    e.preventDefault();
    if (form.checkValidity() === false || !value) {
      e.stopPropagation();
      setValidated(true);
      setAddressError(!value);
      return;
    }

    try {
      // Geocode placeId to get formatted address
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ placeId: value }, (results, status) => {
        if (status === 'OK') {
          if (results[0]) {
            const formattedAddress = results[0].formatted_address;
            setFormattedAddress(formattedAddress);

            createRestaurant(formattedAddress);
          } else {
            throw new Error('No results found for this place ID');
          }
        } else {
          throw new Error(`Geocode failed due to: ${status}`);
        }
      });
    } catch (error) {
      console.error('Error submitting the form', error.message);
      setError(error.message);
    }
  };

  const createRestaurant = async (formattedAddress) => {
    try {
      // Check if restaurant name and address already exist
      const checkResponse = await axios.get(`http://localhost:8080/checkRestaurant`, {
        params: {
          name: restaurant.name,
          address: formattedAddress,
        },
      });

      if (checkResponse.data) {
        throw new Error('A restaurant with this name and address already exists');
      }

      const restaurantResponse = await axios.post('http://localhost:8080/restaurant', {
        ...restaurant,
        address: formattedAddress,
      });

      const restaurantId = restaurantResponse.data.id;

      const formData = new FormData();
      formData.append('restaurantId', restaurantId);
      if (mainImage) formData.append('mainImage', mainImage, 'mainImage.jpg');
      additionalImages.forEach((image, index) => {
        formData.append('additionalImage', image, `additionalImage${index}.jpg`);
      });

      const imageResponse = await axios.post(`http://localhost:8080/photos/restaurant/${restaurantId}`, formData, {
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
          <Form.Group className="mb-3">
            <PlacesPicker
              gMapsKey='AIzaSyAG-SZyG6mMrfhGHJPcc1y8mCFCYd3FWpU'
              placeId={value}
              onChange={setValue}
              placeholder='Search for an address'
            />
            {addressError && (
              <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
                Please enter an address.
              </Form.Control.Feedback>
            )}
          </Form.Group>
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
