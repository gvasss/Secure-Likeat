import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, Table, Button, Spinner, Pagination } from 'react-bootstrap';

export default function AdminAdmin() {

  const [admins, setAdmins] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [adminsPerPage] = useState(10);

  useEffect(() => {
    loadAdmins();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const loadAdmins = async () => {
    try {
      const result = await axios.get("http://localhost:8080/admins");
      setAdmins(result.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading admins:', error);
      setLoading(false);
    }
  };

  const deleteAdmin = async (id) => {
    loadAdmins();
    try {
      await axios.delete(`http://localhost:8080/admin/${id}`);
      setAdmins((admins) => admins.filter(admin => admin.id !== id));
    } catch (error) {
      console.error("There was an error deleting the admin!", error);
    }
  };

  // Search
  const filteredAdmins = admins.filter(admin =>
    admin.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  // Pagination logic
  const indexOfLastAdmin = currentPage * adminsPerPage;
  const indexOfFirstAdmin = indexOfLastAdmin - adminsPerPage;
  const currentAdmins = filteredAdmins.slice(indexOfFirstAdmin, indexOfLastAdmin);

  const totalPages = Math.ceil(filteredAdmins.length / adminsPerPage);

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
      <Row className="py-4">
        <Col>
          <Form className="mb-3" onSubmit={handleSearchSubmit}>
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
              {currentAdmins.map((admin, index) => (
                <tr key={admin.id}>
                  <td>{index + 1}</td>
                  <td>{admin.id}</td>
                  <td>{admin.name}</td>
                  <td>{admin.surname}</td>
                  <td>{admin.username}</td>
                  <td>{admin.email}</td>
                  <td>
                    <Link className="btn btn-dark mx-2" to={`/viewuser/${admin.id}`}>
                      <i className="fas fa-eye"></i> View
                    </Link>
                    <Button variant="danger" className="mx-2" onClick={() => deleteAdmin(admin.id)}>
                      <i className="fas fa-trash-alt"></i> Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {filteredAdmins.length > adminsPerPage && (
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
      <Row>
        <Col>
          <Link className="btn btn-dark" to="/addadmin">
            Add Admin
          </Link>
        </Col>
      </Row>
    </Container>
  );
}
