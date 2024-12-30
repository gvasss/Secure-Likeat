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
    const filteredRestaurants = restaurants.filter(restaurant => {
        const nameMatch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase());
        const locationMatch = restaurant.location.toLowerCase().includes(searchQuery.toLowerCase());
        return nameMatch || locationMatch;
    });
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
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
                        {filteredRestaurants.map((restaurant, index) => (
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
            </div>
        </Container>
    );
}

export default Request;