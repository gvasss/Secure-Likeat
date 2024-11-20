import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Spinner, Container, Carousel } from 'react-bootstrap';

export default function EditRestaurant() {

    const { id } = useParams();
    const [mainImage, setMainImage] = useState(null);
    const [additionalImages, setAdditionalImages] = useState([]);
    const [previousImages, setPreviousImages] = useState([]);
    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [phoneError, setPhoneError] = useState("");
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    let navigate = useNavigate();

    const [restaurant, setRestaurant] = useState({
        clientUserId: "",
        name: "",
        address: "",
        style: "",
        cuisine: "",
        cost: "",
        information: "",
        phone: "",
        openingHours: "",
        location: "",
    });

    const { clientUserId, name, address, style, cuisine, cost, information, phone, openingHours, location } = restaurant;

    const loadRestaurant = async () => {
        try {
            const result = await axios.get(`http://localhost:8080/restaurant/${id}`);
            setRestaurant(result.data);
            setLoading(false);
        } catch (error) {
            console.error("Error loading restaurant", error);
            setLoading(false);
        }
    };

    const loadImages = async () => {
        try {
            const result = await axios.get(`http://localhost:8080/photos/restaurant/${id}`);
            setPreviousImages(result.data);
            setLoading(false);
        } catch (error) {
            console.error("Error loading images", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRestaurant();
        loadImages();
    }, []);

    const onSubmit = async (e) => {
        const form = e.currentTarget;
        e.preventDefault();
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }

        if (!validatePhoneNumber(phone)) {
            setError("Please enter a valid phone number.");
            return;
        }

        try {
            await axios.put(`http://localhost:8080/restaurant/${id}`, restaurant);
            const formData = new FormData();
            if (mainImage) formData.append('mainImage', mainImage, 'mainImage.jpg');
            additionalImages.forEach((image, index) => {
                formData.append('additionalImage', image, `additionalImage${index}.jpg`);
            });

            await axios.post(`http://localhost:8080/photos/restaurant/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate("/clientrestaurant");
        } catch (error) {
            console.error('Error submitting the form:', error.response ? error.response.data : error.message);
            setError(error.response ? error.response.data : error.message);
      }
    };

    const validatePhoneNumber = (phoneNumber) => {
        const phonePattern = /^[2-9]\d{2}\d{3}\d{4}$/;
        return phonePattern.test(phoneNumber);
    };

    const onInputChange = (e) => {
        setRestaurant({ ...restaurant, [e.target.name]: e.target.value });
    };

    const onMainImageChange = (e) => {
        setMainImage(e.target.files[0]);
    };

    const onAdditionalImagesChange = (e) => {
        setAdditionalImages([...e.target.files]);
    };

    const handleDeleteImage = async (imageId) => {
        try {
            await axios.delete(`http://localhost:8080/photos/${imageId}`);
            const updatedImages = previousImages.filter(image => image.id !== imageId);
            setPreviousImages(updatedImages);
            
            if (currentImageIndex >= updatedImages.length) {
                setCurrentImageIndex(Math.max(0, updatedImages.length - 1));
            }
        } catch (error) {
            console.error("Error deleting image", error);
        }
    };

    const handleSelect = (selectedIndex) => {
        setCurrentImageIndex(selectedIndex);
    };

    const imageStyle = {
        width: '100%',
        height: '350px',
        objectFit: 'contain',
        backgroundColor: '#e4e6e8',
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
        <Container className="py-4">
            <i className="fas fa-utensils fa-3x"></i>
            <h3 className="text-center m-3 mb-4">Edit Restaurant</h3>
            <div className="col-md-6 offset-md-3 rounded p-4" >
                <Form noValidate validated={validated} onSubmit={onSubmit} encType="multipart/form-data">
                    <Form.Floating className="mb-3">
                        <Form.Control
                            id="floatingName"
                            type="text"
                            placeholder="Enter your name"
                            name="name"
                            value={name}
                            onChange={onInputChange}
                            required
                        />
                        <label htmlFor="floatingName">Name</label>
                        <Form.Control.Feedback type="invalid">
                            Please enter the restaurant name.
                        </Form.Control.Feedback>
                    </Form.Floating>
                    <Form.Floating className="mb-3">
                        <Form.Control
                            id="floatingAddress"
                            type="text"
                            placeholder="Enter your address"
                            name="address"
                            value={address}
                            onChange={onInputChange}
                            required
                        />
                        <label htmlFor="floatingAddress">Address</label>
                        <Form.Control.Feedback type="invalid">
                            Please enter the restaurant address.
                        </Form.Control.Feedback>
                    </Form.Floating>
                    <Form.Floating className="mb-3">
                        <Form.Control
                            id="floatingStyle"
                            type="text"
                            placeholder="Enter your style"
                            name="style"
                            value={style}
                            onChange={onInputChange}
                            required
                        />
                        <label htmlFor="floatingStyle">Style</label>
                        <Form.Control.Feedback type="invalid">
                            Please enter the restaurant style.
                        </Form.Control.Feedback>
                    </Form.Floating>
                    <Form.Floating className="mb-3">
                        <Form.Control
                            id="floatingCuisine"
                            type="text"
                            placeholder="Enter your cuisine"
                            name="cuisine"
                            value={cuisine}
                            onChange={onInputChange}
                            required
                        />
                        <label htmlFor="floatingCuisine">Cuisine</label>
                        <Form.Control.Feedback type="invalid">
                            Please enter the restaurant cuisine.
                        </Form.Control.Feedback>
                    </Form.Floating>
                    <Form.Floating className="mb-3">
                        <Form.Control
                            id="floatingCost"
                            type="number"
                            placeholder="Enter your cost"
                            name="cost"
                            value={cost}
                            onChange={onInputChange}
                            required
                            min={1}
                            max={5}
                        />
                        <label htmlFor="floatingCost">Cost</label>
                        <Form.Control.Feedback type="invalid">
                            Please enter the cost rating between 1 and 5.
                        </Form.Control.Feedback>
                    </Form.Floating>
                    <Form.Floating className="mb-3">
                        <Form.Control
                            as="textarea"
                            id="floatingInformation"
                            type="textarea"
                            placeholder="Enter your information"
                            name="information"
                            value={information}
                            onChange={onInputChange}
                            required
                            style={{ height: '100px' }}
                        />
                        <label htmlFor="floatingInformation">Information</label>
                        <Form.Control.Feedback type="invalid">
                            Please enter the restaurant information.
                        </Form.Control.Feedback>
                    </Form.Floating>
                    <Form.Floating className="mb-3">
                        <Form.Control
                            id="floatingPhone"
                            type="tel"
                            placeholder="Enter your phone"
                            name="phone"
                            value={phone}
                            onChange={onInputChange}
                            required
                        />
                        <label htmlFor="floatingPhone">Phone</label>
                        <Form.Control.Feedback type="invalid">
                            Please enter a valid phone number.
                        </Form.Control.Feedback>
                    </Form.Floating>
                    <Form.Floating className="mb-3">
                        <Form.Control
                            id="floatingOpeningHours"
                            type="text"
                            placeholder="Enter your opening hours"
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
                            placeholder="Enter your location"
                            name="location"
                            value={location}
                            onChange={onInputChange}
                            required
                        />
                        <label htmlFor="floatingLocation">Location</label>
                        <Form.Control.Feedback type="invalid">
                            Please enter the location.
                        </Form.Control.Feedback>
                    </Form.Floating>
                    <div style={{ marginTop: '20px' }}>
                        <h5>{previousImages[currentImageIndex]?.isMain ? "Main Image" : "Additional Images"}</h5>
                        {previousImages.length > 0 ? (
                            <Carousel activeIndex={currentImageIndex} onSelect={handleSelect} className="mb-3" data-bs-theme="dark">
                                {previousImages.map((image, index) => (
                                    <Carousel.Item key={index}>
                                        <img
                                            className="d-block w-100"
                                            src={`data:image/jpeg;base64,${image.image}`}
                                            alt={`Image ${index}`}
                                            style={imageStyle}
                                        />
                                        <Carousel.Caption>
                                            <Button variant="danger" onClick={() => handleDeleteImage(image.id)}>
                                                Delete
                                            </Button>
                                        </Carousel.Caption>
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        ) : (
                            <div className="alert alert-warning" role="alert">
                                <p>No images available</p>
                            </div>
                        )}
                    </div>
                    <Form.Group controlId="formFileMain" className="mb-3">
                        <Form.Label>Upload Main Image</Form.Label>
                        <Form.Control type="file" name="mainImage" onChange={onMainImageChange} />
                    </Form.Group>
                    <Form.Group controlId="formFileAdditional" className="mb-3">
                        <Form.Label>Upload Additional Images</Form.Label>
                        <Form.Control type="file" multiple name="additionalImages" onChange={onAdditionalImagesChange} />
                    </Form.Group>
                    {error && <p className="alert alert-danger">{error}</p>}
                    <Button variant="danger" onClick={() => window.history.back()}>Cancel</Button>{' '}
                    <Button variant="btn btn-dark" type="submit" >Submit</Button>
                </Form>
            </div>
        </Container>
    );
}
