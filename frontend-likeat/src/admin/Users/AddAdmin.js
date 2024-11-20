import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Form } from 'react-bootstrap';

export default function AddAdmin() {

  let navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState(null);

  const [admin, setAdmin] = useState({
    username: '',
    name: '',
    surname: '',
    password: '',
    email: '',
    role: 'admin',
    userType: 'admin',
    location: '',
    reviews: '',
  });

  const { username, name, surname, password, email } = admin;

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setAdmin({ ...admin, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      // Check if username exists
      const usernameResponse = await fetch(`http://localhost:8080/checkUsername/${username}`);
      if (!usernameResponse.ok) {
        throw new Error('Failed to check username availability');
      }
      const isUsernameExists = await usernameResponse.json();

      if (isUsernameExists) {
        setError('Username already exists.');
        return;
      }

      // Check if email exists
      const emailResponse = await fetch(`http://localhost:8080/checkEmail/${email}`);
      if (!emailResponse.ok) {
        throw new Error('Failed to check email availability');
      }
      const isEmailExists = await emailResponse.json();

      if (isEmailExists) {
        setError('Email already exists.');
        return;
      }

      const response = await axios.post('http://localhost:8080/admin', admin);

    
      window.history.back()
    } catch (error) {
      console.error('Registration failed:', error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data : error.message);
    }
  };

  return (
    <Container className="py-4">
      <i className="fas fa-user-shield fa-3x"></i>
      <h3 className="text-center m-3 mb-4">Add Admin</h3>
      <div className="col-md-6 offset-md-3 rounded p-4">
        <Form noValidate validated={validated} onSubmit={onSubmit}>
          <Form.Floating className="mb-3">
            <Form.Control
              id="floatingUsername"
              type="text"
              placeholder="Enter your username"
              name="username"
              value={username}
              onChange={onInputChange}
              required
            />
            <label htmlFor="floatingUsername">Username</label>
            <Form.Control.Feedback type="invalid">
              Please enter a username.
            </Form.Control.Feedback>
          </Form.Floating>
          <Form.Floating className="mb-3">
            <Form.Control
              id="floatingName"
              type="text"
              placeholder="Enter your name"
              name="name"
              value={name}
              onChange={onInputChange}
              required
            />
            <label htmlFor="floatingName">Name</label>
            <Form.Control.Feedback type="invalid">
              Please enter a name.
            </Form.Control.Feedback>
          </Form.Floating>
          <Form.Floating className="mb-3">
            <Form.Control
              id="floatingSurname"
              type="text"
              placeholder="Enter your surname"
              name="surname"
              value={surname}
              onChange={onInputChange}
              required
            />
            <label htmlFor="floatingSurname">Surname</label>
            <Form.Control.Feedback type="invalid">
              Please enter a surname.
            </Form.Control.Feedback>
          </Form.Floating>
          <Form.Floating className="mb-3">
            <Form.Control
              id="floatingPassword"
              type="password"
              placeholder="Enter your password"
              name="password"
              value={password}
              onChange={onInputChange}
              required
            />
            <label htmlFor="floatingPassword">Password</label>
            <Form.Control.Feedback type="invalid">
              Please enter a password.
            </Form.Control.Feedback>
          </Form.Floating>
          <Form.Floating className="mb-3">
            <Form.Control
              id="floatingEmail"
              type="email"
              placeholder="Enter your email"
              name="email"
              value={email}
              onChange={onInputChange}
              required
            />
            <label htmlFor="floatingEmail">Email</label>
            <Form.Control.Feedback type="invalid">
              Please enter a valid email address.
            </Form.Control.Feedback>
          </Form.Floating>
          {error && <p className="alert alert-danger">{error}</p>}
          <Button variant="danger" onClick={() => window.history.back()}>Cancel</Button>{' '}
          <Button type="submit" className="btn btn-dark">Submit</Button>
        </Form>
      </div>
    </Container>
  );
}
