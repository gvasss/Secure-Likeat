import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, Table, Button, Spinner, Pagination } from 'react-bootstrap';

export default function AdminClient() {
  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 10;

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const result = await axios.get('http://localhost:8080/clients');
      setClients(result.data);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = useCallback(async (id) => {
    try {
      await axios.delete(`http://localhost:8080/client/${id}`);
      setClients((prevClients) => prevClients.filter(client => client.id !== id));
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  }, []);

  const filteredClients = useMemo(() => {
    return clients.filter(client =>
      client.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [clients, searchQuery]);

  const currentClients = useMemo(() => {
    const indexOfLastClient = currentPage * clientsPerPage;
    const indexOfFirstClient = indexOfLastClient - clientsPerPage;
    return filteredClients.slice(indexOfFirstClient, indexOfLastClient);
  }, [currentPage, filteredClients, clientsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredClients.length / clientsPerPage);
  }, [filteredClients.length, clientsPerPage]);

  const handleSearch = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
  }, []);

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
      <Row className="py-4">
        <Col>
          <Form className="mb-3">
            <Form.Control
              type="search"
              placeholder="Search by Username"
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
                <th>Name</th>
                <th>Surname</th>
                <th>Username</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentClients.map((client, index) => (
                <tr key={client.id}>
                  <td>{index + 1 + (currentPage - 1) * clientsPerPage}</td>
                  <td>{client.id}</td>
                  <td>{client.name}</td>
                  <td>{client.surname}</td>
                  <td>{client.username}</td>
                  <td>{client.email}</td>
                  <td>
                    <Link className="btn btn-dark mx-2" to={`/viewuser/${client.id}`}>
                      <i className="fas fa-eye"></i> View
                    </Link>
                    <Button variant="danger" className="mx-2" onClick={() => deleteClient(client.id)}>
                      <i className="fas fa-trash-alt"></i> Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {filteredClients.length > clientsPerPage && (
            <Pagination className="justify-content-center pagination-dark">
              {[...Array(totalPages).keys()].map(number => (
                <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => handlePageChange(number + 1)}>
                  {number + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          )}
        </Col>
      </Row>
    </Container>
  );
}
