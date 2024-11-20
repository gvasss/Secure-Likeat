import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import Admin from './Users/AdminAdmin';
import Client from './Users/AdminClient';
import Customer from './Users/AdminCustomer';
import Restaurant from './Restaurant/AdminRestaurant';
import Request from './Restaurant/Request';
import Review from './Review/AdminReview';
import './Dashboard.css';

export default function Dashboard() {

    const [activeTab, setActiveTab] = useState('Admins');

    //tab
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        localStorage.setItem('activeTab', tab);
    };
    useEffect(() => {
        const storedTab = localStorage.getItem('activeTab');
        if (storedTab) {
            setActiveTab(storedTab);
        }
    }, []);

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
