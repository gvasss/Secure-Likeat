import { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, Table, Button, Spinner, Alert } from 'react-bootstrap';
import { getClients, deleteClientById } from '../../../services/users';

const AdminClient = () => {
  const [clients, setClients] = useState([]);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 10;

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const clientsData = await getClients();
      setClients(clientsData);
    } catch (error) {
      setError('Error fetching clients:');
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async (id) => {
    try {
      await deleteClientById(id);
      setClients((prevClients) => prevClients.filter(client => client.id !== id));
      setAlertMessage('Client deleted successfully.');
      setAlertVariant('success');
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    } catch (error) {
      setError('Error deleting client:');
      console.error('Error deleting client:', error);
    }
  };

  const filteredClients = useMemo(() => {
    return clients.filter(client =>
      client.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [clients, searchQuery]);

  const handleSearch = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);
  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);

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
                  <td>{index+1}</td>
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

        </Col>
      </Row>
    </Container>
  );
}

export default AdminClient;