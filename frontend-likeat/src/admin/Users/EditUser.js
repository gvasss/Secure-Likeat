import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Container, Alert, Modal } from 'react-bootstrap';

export default function EditUser() {
  const { id } = useParams();
  const userRole = localStorage.getItem('userRole') || '';
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState(null);
  const [existingUsername, setExistingUsername] = useState(false);
  const [existingEmail, setExistingEmail] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [user, setUser] = useState({
    username: "",
    name: "",
    surname: "",
    email: "",
    location: "",
  });
  const navigate = useNavigate();

  const { username, name, surname, email, location } = user;

  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const result = await axios.get(`http://localhost:8080/user/${id}`);
      setUser(result.data);
    } catch (err) {
      setError('Failed to load user data.');
      console.error(err);
    }
  };

  const checkUsernameAndEmail = async () => {
    try {
      const usernameResponse = await axios.get(`http://localhost:8080/checkUsernameForUpdate/${id}/${username}`);
      setExistingUsername(false);
      if (usernameResponse.data) {
        setExistingUsername(true);
        setExistingUsername('Username already exists.');
        return false;
      } else {
        setExistingUsername(false);
      }
    } catch (error) {
      console.error('Failed to check username.', error);
      return false;
    }

    try {
      const emailResponse = await axios.get(`http://localhost:8080/checkEmailForUpdate/${id}/${email}`);
      setExistingEmail(false);
      if (emailResponse.data) {
        setExistingEmail(true);
        setExistingEmail('Email already exists.');
        return false;
      } else {
        setExistingEmail(false);
      }
    } catch (error) {
      console.error('Failed to check email.', error);
      return false;
    }

    return true;
  };

  const onSubmit = async (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    const isAvailable = await checkUsernameAndEmail();
    if (isAvailable) {
      setShowPasswordModal(true);
    }
  };

  const handlePasswordSubmit = async () => {
    try {
      await axios.post(`http://localhost:8080/user/${id}/verify-password`, { currentPassword });
      setPasswordError('');

      const endpoint = getEndpoint(userRole, id);
      await axios.put(endpoint, user);
      setShowPasswordModal(false);
      navigate('/profile');
    } catch (err) {
      setPasswordError('Current password is incorrect.');
    }
  };

  const getEndpoint = (role, id) => {
    switch (role) {
      case 'admin':
        return `http://localhost:8080/admin/${id}`;
      case 'client':
        return `http://localhost:8080/client/${id}`;
      case 'customer':
        return `http://localhost:8080/customer/${id}`;
      default:
        throw new Error('Unknown user role');
    }
  };

  return (
    <Container className="py-4">
      <i className="fas fa-user-circle fa-4x"></i>
      <h3 className="text-center m-3 mb-4">Edit Profile</h3>
      <div className="col-md-6 offset-md-3 rounded p-4">
        <Form noValidate validated={validated} onSubmit={onSubmit}>
          <Form.Floating className="mb-3">
            <Form.Control
              id="floatingInputCustom"
              type="text"
              name="username"
              value={username}
              onChange={onInputChange}
              placeholder="Username"
              required
              isInvalid={existingUsername}
            />
            <label htmlFor="floatingInputCustom">Username</label>
            <Form.Control.Feedback type="invalid">
              {existingUsername ? existingUsername : "Please enter a valid username."}
            </Form.Control.Feedback>
          </Form.Floating>
          <Form.Floating className="mb-3">
            <Form.Control
              id="floatingInputCustom"
              type="text"
              name="name"
              value={name}
              onChange={onInputChange}
              placeholder="Name"
              required
            />
            <label htmlFor="floatingInputCustom">Name</label>
            <Form.Control.Feedback type="invalid">
              Please provide a name.
            </Form.Control.Feedback>
          </Form.Floating>
          <Form.Floating className="mb-3">
            <Form.Control
              id="floatingInputCustom"
              type="text"
              name="surname"
              value={surname}
              onChange={onInputChange}
              placeholder="Surname"
              required
            />
            <label htmlFor="floatingInputCustom">Surname</label>
            <Form.Control.Feedback type="invalid">
              Please provide a surname.
            </Form.Control.Feedback>
          </Form.Floating>
          <Form.Floating className="mb-3">
            <Form.Control
              id="floatingInputCustom"
              type="email"
              name="email"
              value={email}
              onChange={onInputChange}
              placeholder="name@example.com"
              required
              isInvalid={existingEmail}
            />
            <label htmlFor="floatingInputCustom">Email</label>
            <Form.Control.Feedback type="invalid">
              {existingEmail ? existingEmail : "Please enter a valid email."}
            </Form.Control.Feedback>
          </Form.Floating>
          {userRole === 'customer' && (
            <Form.Floating className="mb-3">
              <Form.Control
                id="floatingLocation"
                type="text"
                placeholder="Enter your location"
                name="location"
                value={location}
                onChange={onInputChange}
              />
              <label htmlFor="floatingLocation">Location</label>
            </Form.Floating>
          )}
          {error && <Alert className="mt-3" variant="danger">{error}</Alert>}
          <Button variant="danger" onClick={() => window.history.back()}>Cancel</Button>{' '}
          <Button type="submit" variant="dark">Update</Button>
        </Form>
      </div>

      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Your Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formCurrentPassword">
            <Form.Control
              id="floatingPassword"
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              isInvalid={!!passwordError}
            />
            <Form.Control.Feedback type="invalid">
              {passwordError}
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowPasswordModal(false)}>Cancel</Button>
          <Button variant="dark" onClick={handlePasswordSubmit}>Submit</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
