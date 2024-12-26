import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';
import { addRestaurant } from '../../../services/restaurants';
import { addPhoto } from '../../../services/photos';

export default function AddRestaurant() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [style, setStyle] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [cost, setCost] = useState('');
  const [information, setInformation] = useState('');
  const [phone, setPhone] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [location, setLocation] = useState('');

  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);

  const [validated, setValidated] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onMainImageChange = (e) => {
    setMainImage(e.target.files[0]);
  };

  const onAdditionalImagesChange = (e) => {
    setAdditionalImages([...e.target.files]);
  };

  const handleNewRestaurant = async (e) => {
    const form = e.currentTarget;

    e.preventDefault();
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    const restaurant = { name, address, style, cuisine, cost, information, phone, openingHours, location };
    try {
      const restaurantId = await addRestaurant(restaurant);

      if (mainImage || additionalImages.length > 0) {
        await addPhoto(restaurantId, mainImage, additionalImages);
      }

      navigate('/client/restaurants');
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
    }
  };

  return (
    <Container className="py-4">
      <i className="fas fa-utensils fa-3x"></i>
      <h3 className="text-center m-3 mb-4">Add Restaurant</h3>
      <div className="col-md-6 offset-md-3 rounded p-4">
        <Form noValidate validated={validated} onSubmit={handleNewRestaurant}>
          <Form.Floating className="mb-3">
            <Form.Control
              id="name"
              type="text"
              placeholder=""
              value={name}
              onChange={(name) => setName(name.target.value)}
              required
            />
            <label htmlFor="name">Name</label>
            <Form.Control.Feedback type="invalid">
              Please enter a name.
            </Form.Control.Feedback>
          </Form.Floating>
          <Form.Floating className="mb-3">
            <Form.Control
              id="address"
              type="text"
              placeholder=""
              value={address}
              onChange={(address) => setAddress(address.target.value)}
              required
            />
            <label htmlFor="address">Address</label>
            <Form.Control.Feedback type="invalid">
              Please enter an address.
            </Form.Control.Feedback>
          </Form.Floating>
          <Form.Floating className="mb-3">
            <Form.Control
              id="style"
              type="text"
              placeholder=""
              value={style}
              onChange={(style) => setStyle(style.target.value)}
              required
            />
            <label htmlFor="style">Style</label>
            <Form.Control.Feedback type="invalid">
              Please enter a style.
            </Form.Control.Feedback>
          </Form.Floating>
          <Form.Floating className="mb-3">
            <Form.Control
              id="cuisine"
              type="text"
              placeholder=""
              value={cuisine}
              onChange={(cuisine) => setCuisine(cuisine.target.value)}
              required
            />
            <label htmlFor="cuisine">Cuisine</label>
            <Form.Control.Feedback type="invalid">
              Please enter a cuisine.
            </Form.Control.Feedback>
          </Form.Floating>
          <Form.Floating className="mb-3">
            <Form.Control
              id="cost"
              type="number"
              placeholder=""
              min={1}
              max={5}
              value={cost}
              onChange={(cost) => setCost(cost.target.value)}
              required
            />
            <label htmlFor="cost">Cost</label>
            <Form.Control.Feedback type="invalid">
              Please enter a cost between 1 and 5.
            </Form.Control.Feedback>
          </Form.Floating>
          <Form.Floating className="mb-3">
            <Form.Control
              as="textarea"
              id="information"
              placeholder=""
              value={information}
              onChange={(information) => setInformation(information.target.value)}
              required
              style={{ height: '100px' }}
            />
            <label htmlFor="information">Information</label>
            <Form.Control.Feedback type="invalid">
              Please enter some information.
            </Form.Control.Feedback>
          </Form.Floating>
          <Form.Floating className="mb-3">
            <Form.Control
              id="phone"
              type="text"
              placeholder=""
              value={phone}
              onChange={(phone) => setPhone(phone.target.value)}
              required
            />
            <label htmlFor="phone">Phone</label>
            <Form.Control.Feedback type="invalid">
              Please enter a phone number.
            </Form.Control.Feedback>
          </Form.Floating>
          <Form.Floating className="mb-3">
            <Form.Control
              id="openingHours"
              type="text"
              placeholder=""
              value={openingHours}
              onChange={(openingHours) => setOpeningHours(openingHours.target.value)}
              required
            />
            <label htmlFor="openingHours">Opening Hours</label>
            <Form.Control.Feedback type="invalid">
              Please enter the opening hours.
            </Form.Control.Feedback>
          </Form.Floating>
          <Form.Floating className="mb-3">
            <Form.Control
              id="location"
              type="text"
              placeholder=""
              name="location"
              value={location}
              onChange={(location) => setLocation(location.target.value)}
              required
            />
            <label htmlFor="location">Location</label>
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
          <Button variant="danger" onClick={() => window.history.back()}>
            Cancel
          </Button>{' '}
          <Button type="submit" className="btn btn-dark">
            Submit
          </Button>
        </Form>
      </div>
    </Container>
  );
}
