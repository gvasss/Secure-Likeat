/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Spinner, Container, Carousel } from 'react-bootstrap';
import { getRestaurant, updateRestaurant } from '../../../services/restaurants';
import { deletePhoto, addPhoto } from '../../../services/photos';

const EditRestaurant = () => {
    const { id } = useParams();

    const [restaurant, setRestaurant] = useState({
        name: "",
        address: "",
        style: "",
        cuisine: "",
        cost: "",
        information: "",
        phone: "",
        openingHours: "",
        location: "",
        mainPhoto: null,
        additionalPhotos: []
    });

    const [mainImage, setMainImage] = useState(null);
    const [additionalImages, setAdditionalImages] = useState([]);

    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRestaurant();
    }, []);

    const fetchRestaurant = async () => {
        try {
            const restautantData = await getRestaurant(id);
            setRestaurant(restautantData);
            setLoading(false);
        } catch {
            setError('Failed to load restaurant data.');
            setLoading(false);
        }
    };

    const onMainImageChange = (e) => {
        setMainImage(e.target.files[0]);
    };

    const onAdditionalImagesChange = (e) => {
        setAdditionalImages([...e.target.files]);
    };

    const handleUpdateRestaurant = async (e) => {
        const form = e.currentTarget;
        e.preventDefault();
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }

        try {
            await updateRestaurant(id, restaurant);
            if (mainImage || additionalImages.length > 0) {
                await addPhoto(id, mainImage, additionalImages);
            }
            navigate("/client/restaurants");
        } catch (error) {
            console.error('Error submitting the form:', error.response ? error.response.data : error.message);
            setError(error.response ? error.response.data : error.message);
      }
    };

    const handleDeleteImage = async (photoId, isMain) => {
        try {
            await deletePhoto(photoId);

            if (isMain) {
                setRestaurant(prev => ({
                    ...prev,
                    mainPhoto: null
                }));
            } else {
                setRestaurant(prev => ({
                    ...prev,
                    additionalPhotos: prev.additionalPhotos.filter(photo => photo.id !== photoId)
                }));
            }
        } catch  {
            setError('Failed to delete photo');
        }
    };

    const onInputChange = (e) => {
        setRestaurant({ ...restaurant, [e.target.name]: e.target.value });
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
                <Form noValidate validated={validated} onSubmit={handleUpdateRestaurant} encType="multipart/form-data">
                    <Form.Floating className="mb-3">
                        <Form.Control
                            id="name"
                            type="text"
                            name="name"
                            value={restaurant.name}
                            onChange={onInputChange}
                            required
                        />
                        <label htmlFor="name">Name</label>
                        <Form.Control.Feedback type="invalid">
                            Please enter the restaurant name.
                        </Form.Control.Feedback>
                    </Form.Floating>
                    <Form.Floating className="mb-3">
                        <Form.Control
                            id="address"
                            type="text"
                            name="address"
                            value={restaurant.address}
                            onChange={onInputChange}
                            required
                        />
                        <label htmlFor="address">Address</label>
                        <Form.Control.Feedback type="invalid">
                            Please enter the restaurant address.
                        </Form.Control.Feedback>
                    </Form.Floating>
                    <Form.Floating className="mb-3">
                        <Form.Control
                            id="style"
                            type="text"
                            name="style"
                            value={restaurant.style}
                            onChange={onInputChange}
                            required
                        />
                        <label htmlFor="style">Style</label>
                        <Form.Control.Feedback type="invalid">
                            Please enter the restaurant style.
                        </Form.Control.Feedback>
                    </Form.Floating>
                    <Form.Floating className="mb-3">
                        <Form.Control
                            id="cuisine"
                            type="text"
                            name="cuisine"
                            value={restaurant.cuisine}
                            onChange={onInputChange}
                            required
                        />
                        <label htmlFor="cuisine">Cuisine</label>
                        <Form.Control.Feedback type="invalid">
                            Please enter the restaurant cuisine.
                        </Form.Control.Feedback>
                    </Form.Floating>
                    <Form.Floating className="mb-3">
                        <Form.Control
                            id="cost"
                            type="number"
                            name="cost"
                            value={restaurant.cost}
                            onChange={onInputChange}
                            required
                            min={1}
                            max={5}
                        />
                        <label htmlFor="cost">Cost</label>
                        <Form.Control.Feedback type="invalid">
                            Please enter the cost rating between 1 and 5.
                        </Form.Control.Feedback>
                    </Form.Floating>
                    <Form.Floating className="mb-3">
                        <Form.Control
                            as="textarea"
                            id="information"
                            type="textarea"
                            name="information"
                            value={restaurant.information}
                            onChange={onInputChange}
                            required
                            style={{ height: '100px' }}
                        />
                        <label htmlFor="information">Information</label>
                        <Form.Control.Feedback type="invalid">
                            Please enter the restaurant information.
                        </Form.Control.Feedback>
                    </Form.Floating>
                    <Form.Floating className="mb-3">
                        <Form.Control
                            id="phone"
                            type="tel"
                            name="phone"
                            value={restaurant.phone}
                            onChange={onInputChange}
                            required
                        />
                        <label htmlFor="phone">Phone</label>
                        <Form.Control.Feedback type="invalid">
                            Please enter a valid phone number.
                        </Form.Control.Feedback>
                    </Form.Floating>
                    <Form.Floating className="mb-3">
                        <Form.Control
                            id="openingHours"
                            type="text"
                            name="openingHours"
                            value={restaurant.openingHours}
                            onChange={onInputChange}
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
                            name="location"
                            value={restaurant.location}
                            onChange={onInputChange}
                            required
                        />
                        <label htmlFor="location">Location</label>
                        <Form.Control.Feedback type="invalid">
                            Please enter the location.
                        </Form.Control.Feedback>
                    </Form.Floating>

                    <div className="mb-3">
                        {(restaurant.mainPhoto || restaurant.additionalPhotos.length > 0) ? (
                            <Carousel>
                                {restaurant.mainPhoto && (
                                    <Carousel.Item key={restaurant.mainPhoto.id}>
                                        <h5 className="text-center mb-2">Main Image</h5>
                                        <img
                                            src={`data:image/jpeg;base64,${restaurant.mainPhoto.image}`}
                                            alt="Main Restaurant"
                                            style={imageStyle}
                                        />
                                        <Carousel.Caption>
                                            <Button 
                                                variant="danger" 
                                                onClick={() => handleDeleteImage(restaurant.mainPhoto.id, true)}
                                            >
                                                Delete
                                            </Button>
                                        </Carousel.Caption>
                                    </Carousel.Item>
                                )}
                                {restaurant.additionalPhotos.map((photo, index) => (
                                    <Carousel.Item key={photo.id}>
                                        <h5 className="text-center mb-2">Additional Image</h5>
                                        <img
                                            src={`data:image/jpeg;base64,${photo.image}`}
                                            alt={`Additional ${index + 1}`}
                                            style={imageStyle}
                                        />
                                        <Carousel.Caption>
                                            <Button 
                                                variant="danger" 
                                                onClick={() => handleDeleteImage(photo.id, false)}
                                            >
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

export default EditRestaurant;