import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import Admin from './AdminAdmin';
import Client from './AdminClient';
import Customer from './AdminCustomer';
import Restaurant from './AdminRestaurant';
import Request from './Request';
import Review from './AdminReview';
import '../../../layout/Dashboard.css';

const Dashboard = () => {

    const [activeTab, setActiveTab] = useState('Admins');

    useEffect(() => {
        const storedTab = localStorage.getItem('activeTab');
        if (storedTab) {
            setActiveTab(storedTab);
        }
    }, []);

    //tab
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        localStorage.setItem('activeTab', tab);
    };

    return (
        <Container className="custom-container">
            <Row className="g-4">
                <Col xl={2}>
                    <Card>
                        <Card.Header className="custom-card-header">
                            Navigate
                        </Card.Header>
                        <Card.Body>
                            <nav className="dashboard-side-nav">
                                <Button className={`nav-link btn btn-dark ${activeTab === 'Admins' ? 'active' : ''}`} onClick={() => handleTabChange('Admins')}>Admins</Button>
                                <Button className={`nav-link btn btn-dark ${activeTab === 'Clients' ? 'active' : ''}`} onClick={() => handleTabChange('Clients')}>Clients</Button>
                                <Button className={`nav-link btn btn-dark ${activeTab === 'Customers' ? 'active' : ''}`} onClick={() => handleTabChange('Customers')}>Customers</Button>
                                <Button className={`nav-link btn btn-dark ${activeTab === 'Restaurants' ? 'active' : ''}`} onClick={() => handleTabChange('Restaurants')}>Restaurants</Button>
                                <Button className={`nav-link btn btn-dark ${activeTab === 'Requests' ? 'active' : ''}`} onClick={() => handleTabChange('Requests')}>Requests</Button>
                                <Button className={`nav-link btn btn-dark ${activeTab === 'Reviews' ? 'active' : ''}`} onClick={() => handleTabChange('Reviews')}>Reviews</Button>
                            </nav>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={10}>
                    <Card>
                        <Card.Header className="custom-card-header">
                            {activeTab}
                        </Card.Header>
                        <Card.Body>
                            {activeTab === 'Admins' && <Admin />}
                            {activeTab === 'Clients' && <Client />}
                            {activeTab === 'Customers' && <Customer />}
                            {activeTab === 'Restaurants' && <Restaurant />}
                            {activeTab === 'Requests' && <Request />}
                            {activeTab === 'Reviews' && <Review />}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Dashboard;