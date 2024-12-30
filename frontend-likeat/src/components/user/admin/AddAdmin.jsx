import { useState } from 'react';
import { Button, Container, Form, Alert } from 'react-bootstrap';
import authentication from '../../../services/authentication';

const AddAdmin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [role] = useState('ADMIN');
  const [showPassword, setShowPassword] = useState(false);

  const { register } = authentication;
  
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState(null);

  const clearData = () => {
    setUsername("");
    setPassword("");
    setName("");
    setSurname("");
    setEmail("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (event) => {
    const form = event.currentTarget;

    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      const user = { username, password, name, surname, email, role }
      await register(user);
      clearData();
      window.history.back()
    } catch (error) {
      console.error('Registration failed:');
      setError(error.response ? error.response.data : error.message);
    }
  };

  return (
    <Container className="py-4">
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      <i className="fas fa-user-shield fa-3x"></i>
      <h3 className="text-center m-3 mb-4">Add Admin</h3>
      <div className="col-md-6 offset-md-3 rounded p-4">
        <Form noValidate validated={validated} onSubmit={onSubmit}>
          <Form.Floating className="mb-3">
            <Form.Control
              id="username"
              type="text"
              placeholder=""
              value={username}
              onChange={(username) => setUsername(username.target.value)}
              required
            />
            <label htmlFor="username">Username</label>
            <Form.Control.Feedback type="invalid">
              Please enter a username.
            </Form.Control.Feedback>
          </Form.Floating>
          <Form.Floating className="mb-3">
            <Form.Control
              id="name"
              type="text"
              placeholder=""
              value={name}
              onChange={(name) => setName(name.target.value)}
              required
            />
            <label htmlFor="name">Name</label>
            <Form.Control.Feedback type="invalid">
              Please enter a name.
            </Form.Control.Feedback>
          </Form.Floating>
          <Form.Floating className="mb-3">
            <Form.Control
              id="surname"
              type="text"
              placeholder=""
              value={surname}
              onChange={(surname) => setSurname(surname.target.value)}
              required
            />
            <label htmlFor="surname">Surname</label>
            <Form.Control.Feedback type="invalid">
              Please enter a surname.
            </Form.Control.Feedback>
          </Form.Floating>
          <Form.Floating className="mb-3">
            <Form.Control
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder=""
              value={password}
              onChange={(password) => setPassword(password.target.value)}
              required
            />
            <label htmlFor="password">Password</label>
            <span
              className="password-toggle position-absolute"
              onClick={togglePasswordVisibility}
              style={{ 
                cursor: 'pointer',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 100
              }}
            >
              <i className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
            </span>
            <Form.Control.Feedback type="invalid">
              Please enter your password.
            </Form.Control.Feedback>
          </Form.Floating>
          <Form.Floating className="mb-3">
            <Form.Control
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(email) => setEmail(email.target.value)}
              required
            />
            <label htmlFor="email">Email</label>
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

export default AddAdmin;