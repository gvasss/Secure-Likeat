import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Form, Table, Button, Spinner, Alert } from 'react-bootstrap';
import { getAllRequest, acceptStatus, rejectStatus } from '../../../services/restaurants';

const Request = () => {
    const [restaurants, setRestaurants] = useState([]);

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertVariant, setAlertVariant] = useState('');

    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const requestsPerPage = 10;

    useEffect(() => {
        fetchRestaurants();
    },[])

    const fetchRestaurants = async() => {
        try {
            const restaurantsData = await getAllRequest();
            setRestaurants(restaurantsData);
            setLoading(false);
        } catch (error) {
            setError('Error fetching restaurants');
            console.error("Error fetching restaurants", error);
            setLoading(false);
        }
    };

    const acceptRestaurant = async (id) => {
        try {
            await acceptStatus(id);
            setRestaurants((restaurants) => restaurants.filter(restaurant => restaurant.id !== id));
            setAlertMessage('Restaurant accepted successfully.');
            setAlertVariant('success');
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 3000);
        } catch (error) {
            setError('Error accepting restaurants');
            console.error("Error accepting restaurants", error);
        }
    };

    const rejectRestaurant = async (id) => {
        try {
            await rejectStatus(id);
            setRestaurants((restaurants) => restaurants.filter(restaurant => restaurant.id !== id));
            setAlertMessage('Restaurant rejected successfully.');
            setAlertVariant('success');
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 3000);
        } catch (error) {
            setError('Error rejecting restaurants');
            console.error("Error rejecting restaurants", error);
        }
    };

    //search
    const filteredRequests = restaurants.filter(restaurant => {
        const nameMatch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase());
        const locationMatch = restaurant.location.toLowerCase().includes(searchQuery.toLowerCase());
        return nameMatch || locationMatch;
    });
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastRequest = currentPage * requestsPerPage;
    const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
    const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);
    const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);

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
                <Form className="mb-3">
                    <Form.Control
                        type="search"
                        placeholder="Search by Name and Location"
                        aria-label="Search"
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </Form>

                {currentRequests.length === 0 ? (
                    <div className="col">
                        <div className="alert alert-warning" role="alert">
                            No requests found.
                        </div>
                    </div>
                ) : (
                <Table striped bordered hover responsive>
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Id</th>
                            <th>Client</th>
                            <th>Name</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRequests.map((restaurant, index) => (
                            <tr key={restaurant.id}>
                                <td>{index+1}</td>
                                <td>{restaurant.id}</td>
                                <td>{restaurant.clientName}</td>
                                <td>{restaurant.name}</td>
                                <td>{restaurant.location}</td>
                                <td>{restaurant.status}</td>
                                <td>
                                    <Button variant="success" className="mx-2" onClick={() => acceptRestaurant(restaurant.id)}>
                                        <i className="fas fa-check"></i> Accept
                                    </Button>
                                    <Button variant="danger" className="mx-2" onClick={() => rejectRestaurant(restaurant.id)}>
                                        <i className="fas fa-times"></i> Reject
                                    </Button>
                                    <Link className="btn btn-dark mx-2" to={`/viewrestaurant/${restaurant.id}`}>
                                        <i className="fas fa-eye"></i> View
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                )}

                <nav aria-label="Page navigation example">
                    <ul className="pagination justify-content-center pagination-dark">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                        </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <li key={index + 1} className={`page-item ${index + 1 === currentPage ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                            {index + 1}
                        </button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                        </button>
                    </li>
                    </ul>
                </nav>

            </div>
        </Container>
    );
}

export default Request;