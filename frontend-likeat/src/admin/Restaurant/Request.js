import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import { Container, Form, Table, Button, Spinner } from 'react-bootstrap';

export default function Request() {

    const [restaurants, setRestaurants] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRestaurants();
    },[])

    const loadRestaurants = async() => {
        try {
            const result = await axios.get("http://localhost:8080/restaurant/request");
            setRestaurants(result.data);
            setLoading(false);
        } catch (error) {
            console.error("Error loading restaurants", error);
            setLoading(false);
        }
    };

    const acceptRestaurant = async (id) => {
        try {
            await axios.put(`http://localhost:8080/restaurant/statusAccept/${id}`);
            loadRestaurants();
        } catch (error) {
            console.error("Error accepting restaurants", error);
        }
    };

    const rejectRestaurant = async (id) => {
        try {
            await axios.put(`http://localhost:8080/restaurant/statusReject/${id}`);
            loadRestaurants();
        } catch (error) {
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
                            <th>Style</th>
                            <th>Location</th>
                            <th>Cost</th>
                            <th>Address</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRestaurants.map((restaurant, index) => (
                            <tr key={restaurant.id}>
                                <td>{index+1}</td>
                                <td>{restaurant.id}</td>
                                <td>{restaurant.clientUserId ? restaurant.clientUserId.username : 'N/A'}</td>
                                <td>{restaurant.name}</td>
                                <td>{restaurant.style}</td>
                                <td>{restaurant.location}</td>
                                <td>{restaurant.cost}</td>
                                <td>{restaurant.address}</td>
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
