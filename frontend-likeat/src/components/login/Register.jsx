import { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'
import authentication from '../../services/authentication';

const Register = ({ changeAuthMode, setShow }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  const [validated, setValidated] = useState(false);
  const [error, setError] = useState('');

  const Auth = useAuth();
  const setUserFromToken = Auth.setUserFromToken;
  const { register } = authentication;
  const navigate = useNavigate();

  const clearData = () => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setName("");
    setSurname("");
    setEmail("");
    setRole("");
  };

  const handleClose = () => {
    clearData();
    setValidated(false);
    setError(null);
    setShow(false);
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    const user = { username, password, name, surname, email, role };
    if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
    }

    try {
      const response = await register(user);
      const { accessToken } = response.data
      setUserFromToken(accessToken)

      handleClose();
      navigate("/");
    } catch {
      setError('Register failed. Please try again.');
    }
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleRegister}>
        <h3 className="Auth-form-title">Sign Up</h3>
        <div className="text-center">
            Already registered?{" "}
            <span className="link-primary" onClick={changeAuthMode} style={{ cursor: 'pointer' }}>
                Sign In
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
            <label htmlFor="name">Full Name</label>
            <Form.Control.Feedback type="invalid">
                Please enter your name.
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
                Please enter your surname.
            </Form.Control.Feedback>
        </Form.Floating>
        <Form.Floating className="mb-3">
            <Form.Control
                id="email"
                type="email"
                placeholder=""
                value={email}
                onChange={(email) => setEmail(email.target.value)}
                required
            />
            <label htmlFor="email">Email address</label>
            <Form.Control.Feedback type="invalid">
                Please enter a valid email address.
            </Form.Control.Feedback>
        </Form.Floating>
        <Form.Floating className="mb-3">
            <Form.Control
                id="password"
                type={"password"}
                placeholder=""
                value={password}
                onChange={(password) => setPassword(password.target.value)}
                required
            />
            <label htmlFor="password">Password</label>
            <Form.Control.Feedback type="invalid">
                Please enter a password.
            </Form.Control.Feedback>
        </Form.Floating>
        <Form.Floating className="mb-3">
            <Form.Control
                id="confirmPassword"
                type="password"
                placeholder=""
                value={confirmPassword}
                onChange={(confirmPassword) => setConfirmPassword(confirmPassword.target.value)}
                required
            />
            <label htmlFor="confirmPassword">Confirm Password</label>
            <Form.Control.Feedback type="invalid">
                Please confirm your password.
            </Form.Control.Feedback>
        </Form.Floating>
        <Form.Floating className="mb-3">
            <Form.Select
                id="role"
                value={role}
                onChange={(role) => setRole(role.target.value)}
                required
            >
                <option value="">Select role</option>
                <option value="CLIENT">Client</option>
                <option value="CUSTOMER">Customer</option>
            </Form.Select>
            <label htmlFor="role">Role</label>
            <Form.Control.Feedback type="invalid">
                Please select a role.
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

Register.propTypes = {
  changeAuthMode: PropTypes.func.isRequired,
  setShow: PropTypes.func.isRequired,
};

export default Register;