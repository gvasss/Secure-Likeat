import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Form, Table, Button, Spinner, Alert } from 'react-bootstrap';
import { getAllReviews, deleteReview } from '../../../services/reviews';

const AdminReview = () => {
    const [reviews, setReviews] = useState([]);

    const [searchDay, setSearchDay] = useState('');
    const [searchMonth, setSearchMonth] = useState('');
    const [searchCustomer, setSearchCustomer] = useState('');
    const [searchRestaurant, setSearchRestaurant] = useState('');

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertVariant, setAlertVariant] = useState('');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchReviews();
    }, [])

    const fetchReviews = async () => {
        try {
            const reviewsData = await getAllReviews();
            setReviews(reviewsData);
            setLoading(false);
        } catch (error) {
            setError('Error fetching reviews:');
            console.error('Error fetching reviews', error);
            setLoading(false);
        }
    };

    const handleDeleteReview = async (id) => {
        try {
            await deleteReview(id);
            setReviews((reviews) => reviews.filter(review => review.id !== id));
            setAlertMessage('Review deleted successfully.');
            setAlertVariant('success');
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 3000);
        } catch (error) {
            setError('Error deleting review');
            console.error("There was an error deleting the review!", error);
        }
    };

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'day':
                setSearchDay(value);
                break;
            case 'month':
                setSearchMonth(value);
                break;
            case 'customer':
                setSearchCustomer(value);
                break;
            case 'restaurant':
                setSearchRestaurant(value);
                break;
            default:
                break;
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
    };

    // Filtering logic
    const filteredReviews = reviews.filter(review => {
        let matchesDay = true;
        let matchesMonth = true;
        let matchesCustomer = true;
        let matchesRestaurant = true;

        if (searchDay) {
            matchesDay = review.date.includes(searchDay);
        }
        if (searchMonth) {
            matchesMonth = review.date.includes(searchMonth);
        }
        if (searchCustomer) {
            matchesCustomer = review.customerUserId.username.toLowerCase().includes(searchCustomer.toLowerCase());
        }
        if (searchRestaurant) {
            matchesRestaurant = review.restaurantId.name.toLowerCase().includes(searchRestaurant.toLowerCase());
        }

        return matchesDay && matchesMonth && matchesCustomer && matchesRestaurant;
    });

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
        <Container>
            {showAlert && <Alert variant={alertVariant}>{alertMessage}</Alert>}
            {error && <p className="alert alert-danger">{error}</p>}
            <div className='py-4'>
                <Form className="row g-3" onSubmit={handleSearchSubmit}>
                    <Form.Group className="col-md-3">
                        <Form.Control
                            type="text"
                            placeholder="Day"
                            name="day"
                            value={searchDay}
                            onChange={handleSearchChange}
                        />
                    </Form.Group>
                    <Form.Group className="col-md-3">
                        <Form.Control
                            type="text"
                            placeholder="Month"
                            name="month"
                            value={searchMonth}
                            onChange={handleSearchChange}
                        />
                    </Form.Group>
                    <Form.Group className="col-md-3">
                        <Form.Control
                            type="text"
                            placeholder="Customer"
                            name="customer"
                            value={searchCustomer}
                            onChange={handleSearchChange}
                        />
                    </Form.Group>
                    <Form.Group className="col-md-3">
                        <Form.Control
                            type="text"
                            placeholder="Restaurant"
                            name="restaurant"
                            value={searchRestaurant}
                            onChange={handleSearchChange}
                        />
                    </Form.Group>
                </Form>
            </div>

            <Table striped bordered hover responsive>
                <thead className="table-dark">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Id</th>
                        <th scope="col">Rating</th>
                        <th scope="col">Description</th>
                        <th scope="col">Date</th>
                        <th scope="col">Customer</th>
                        <th scope="col">Restaurant</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredReviews.map((review, index) => (
                        <tr key={`review-${review.id}-${index}`}>
                            <td>{index+1}</td>
                            <td>{review.id}</td>
                            <td>{review.rating}</td>
                            <td>{review.description}</td>
                            <td>{review.date}</td>
                            <td>{review.customerName}</td>
                            <td>{review.restaurantName}</td>
                            <td>
                                <Link className="btn btn-dark mx-2" to={`/viewreview/${review.id}`}>
                                    <i className="fas fa-eye"></i> View
                                </Link>
                                <Button variant="danger" className="mx-2" onClick={() => handleDeleteReview(review.id)}>
                                    <i className="fas fa-trash-alt"></i> Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

        </Container>
    );
}

export default AdminReview;