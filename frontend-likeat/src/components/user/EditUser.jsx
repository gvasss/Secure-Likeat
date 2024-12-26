import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert, Spinner } from 'react-bootstrap';
import { getProfile, updateUser } from '../../services/users';

const EditUser = () => {
  const [userData, setUserData] = useState({
    name: '',
    surname: '',
    email: ''
  });

  const [validated, setValidated] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const UserData = await getProfile();
      setUserData(UserData);
      setLoading(false);
    } catch {
      setError('Failed to load user data.');
      setLoading(false);
    }
  };

  const handleUpdateUser = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      await updateUser(userData);
      navigate('/profile');
    } catch (err) {
      setError('Failed to update user data.');
      console.error(err);
    }
  };

  const onInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
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
    <Container className="py-4">
      <i className="fas fa-user-circle fa-4x"></i>
      <h3 className="text-center m-3 mb-4">Edit Profile</h3>
      <div className="col-md-6 offset-md-3 rounded p-4">
        <Form noValidate validated={validated} onSubmit={handleUpdateUser}>
          <Form.Floating className="mb-3">
            <Form.Control
              id="name"
              name="name"
              type="text"
              value={userData.name}
              onChange={onInputChange}
              required
            />
            <label htmlFor="name">Name</label>
            <Form.Control.Feedback type="invalid">
              Please provide a name.
            </Form.Control.Feedback>
          </Form.Floating>
          <Form.Floating className="mb-3">
            <Form.Control
              id="surname"
              name="surname"
              type="text"
              value={userData.surname}
              onChange={onInputChange}
              required
            />
            <label htmlFor="surname">Surname</label>
            <Form.Control.Feedback type="invalid">
              Please provide a surname.
            </Form.Control.Feedback>
          </Form.Floating>
          <Form.Floating className="mb-3">
            <Form.Control
              id="email"
              name="email"
              type="email"
              value={userData.email}
              onChange={onInputChange}
              required
            />
            <label htmlFor="email">Email</label>
            <Form.Control.Feedback type="invalid">
              Please enter a valid email.
            </Form.Control.Feedback>
          </Form.Floating>

          {error && <Alert className="mt-3" variant="danger">{error}</Alert>}
          <Button variant="danger" onClick={() => window.history.back()}>Cancel</Button>{' '}
          <Button type="submit" variant="dark">Update</Button>
        </Form>
      </div>

    </Container>
  );
}

export default EditUser;