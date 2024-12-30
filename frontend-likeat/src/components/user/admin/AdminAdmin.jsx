import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, Table, Button, Spinner, Alert } from 'react-bootstrap';
import { getAdmins, deleteAdminById } from '../../../services/users';

const AdminAdmin = () => {
  const [admins, setAdmins] = useState([]);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const adminsData = await getAdmins();
      setAdmins(adminsData);
      setLoading(false);
    } catch (error) {
      setError('Error fetching admins:')
      console.error('Error loading admins:', error);
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (id) => {
    try {
      await deleteAdminById(id);
      setAdmins((admins) => admins.filter(admin => admin.id !== id));
      setAlertMessage('Admin deleted successfully.');
      setAlertVariant('success');
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    } catch (error) {
      setError('Error deleting admin');
      console.error("There was an error deleting the admin", error);
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
              {filteredAdmins.map((admin, index) => (
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
                    <Button variant="danger" className="mx-2" onClick={() => handleDeleteAdmin(admin.id)}>
                      <i className="fas fa-trash-alt"></i> Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

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

export default AdminAdmin;