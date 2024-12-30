import { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'

const Login = ({ changeAuthMode, setShow }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [validated, setValidated] = useState(false);
  const [error, setError] = useState('');

  const Auth = useAuth();
  const login = Auth.login;
  const navigate = useNavigate();
  
  const clearData = () => {
    setUsername("");
    setPassword("");
  };

  const handleClose = () => {
    clearData();
    setValidated(false);
    setError(null);
    setShow(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      await login({ username, password });
      handleClose();
      navigate("/");
    } catch {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleLogin}>
      <h3 className="Auth-form-title">Sign In</h3>
      <div className="text-center">
        Not registered yet?{" "}
        <span className="link-primary" onClick={changeAuthMode} style={{ cursor: 'pointer' }}>
          Sign Up
        </span>
      </div>
      <div className="mb-3"></div>
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
          Please enter your username.
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
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      <div className="d-grid gap-2 mt-3">
        <Button type="submit" variant="dark">
          Submit
        </Button>
      </div>
    </Form>
  );
};

Login.propTypes = {
  changeAuthMode: PropTypes.func.isRequired,
  setShow: PropTypes.func.isRequired,
};

export default Login;