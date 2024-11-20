import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container, Form, Table, Button, Spinner, Pagination } from 'react-bootstrap';

export default function AdminReview() {

    const [reviews, setReviews] = useState([]);
    const [searchDay, setSearchDay] = useState('');
    const [searchMonth, setSearchMonth] = useState('');
    const [searchCustomer, setSearchCustomer] = useState('');
    const [searchRestaurant, setSearchRestaurant] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewsPerPage] = useState(10);

    useEffect(() => {
        loadReviews();
    }, [])

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, [currentPage]);

    const loadReviews = async () => {
        try {
            const result = await axios.get("http://localhost:8080/reviews");
            setReviews(result.data);
            setLoading(false);
        } catch (error) {
            console.error('Error loading reviews:', error);
            setLoading(false);
        }
    };

    const deleteReview = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/review/${id}`);
            setReviews(reviews.filter(review => review.id !== id));
        } catch (error) {
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

    // Pagination logic
    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);

    const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

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
                    {currentReviews.map((review, index) => (
                        <tr key={review.id}>
                            <td>{indexOfFirstReview + index + 1}</td>
                            <td>{review.id}</td>
                            <td>{review.rating}</td>
                            <td>{review.description}</td>
                            <td>{review.date}</td>
                            <td>{review.customerUserId.username}</td>
                            <td>{review.restaurantId.name}</td>
                            <td>
                                <Link className="btn btn-dark mx-2" to={`/viewreview/${review.id}`}>
                                    <i className="fas fa-eye"></i> View
                                </Link>
                                <Button variant="danger" className="mx-2" onClick={() => deleteReview(review.id)}>
                                    <i className="fas fa-trash-alt"></i> Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {totalPages > 1 && (
                <Pagination className="justify-content-center pagination-dark">
                    {[...Array(totalPages).keys()].map(number => (
                        <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => handlePageChange(number + 1)}>
                            {number + 1}
                        </Pagination.Item>
                    ))}
                </Pagination>
            )}
        </Container>
    );
}
