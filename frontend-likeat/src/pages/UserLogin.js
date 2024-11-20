import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import { Form, Button, Alert } from 'react-bootstrap';
import './UserLogin.css';

export default function UserLogin({ setUserRole }) {
  const [show, setShow] = useState(false);
  const [authMode, setAuthMode] = useState("signin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    resetFormData();
    setShow(false);
  };

  const handleShow = () => setShow(true);

  const changeAuthMode = () => {
    setAuthMode(authMode === "signin" ? "signup" : "signin");
    resetFormData();
  };

  const resetFormData = () => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setName("");
    setSurname("");
    setEmail("");
    setRole("");
    setValidated(false);
    setError(null);
  };

  const handleSignIn = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const user = await response.json();
      console.log("User data:", user);
      setUserRole(user.role);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userRole', user.role);

      if (user.role === "admin") {
        navigate("/dashboard");
      } else if (user.role === "customer" || user.role === "client") {
        navigate("/");
      }
      handleClose();
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message);
      setError('Invalid username or password.');
    }
  };

  const handleSignUp = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
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

      const newUser = { username, password, name, surname, email, role, userType: role };
      const url = role === "client" ? 'http://localhost:8080/client' : 'http://localhost:8080/customer';

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error('User creation failed');
      }

      handleClose();
      setAuthMode("signin");
      handleShow();
    } catch (error) {
      console.error('Signup failed:', error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data : error.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <button className="navbar-input" onClick={handleShow}>
        <div className="navbar-btn">
          <span className="navbar-span">Sign In/Up</span>
        </div>
      </button>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton />
        <Modal.Body>
          {authMode === "signin" ? (
            <Form noValidate validated={validated} onSubmit={handleSignIn}>
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
                  id="floatingUsernameSignin"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <label htmlFor="floatingUsernameSignin">Username</label>
                <Form.Control.Feedback type="invalid">
                  Please enter a username.
                </Form.Control.Feedback>
              </Form.Floating>
              <Form.Floating className="mb-3">
                <Form.Control
                  id="floatingPasswordSignin"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label htmlFor="floatingPasswordSignin">Password</label>
                <span
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  style={{ cursor: 'pointer' }}
                >
                  {showPassword ? "Hide password" : "Show password"}
                </span>
                <Form.Control.Feedback type="invalid">
                  Please enter a password.
                </Form.Control.Feedback>
              </Form.Floating>
              {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
              <div className="d-grid gap-2 mt-3">
                <Button type="submit" variant="dark">
                  Submit
                </Button>
                {/* <Button variant="link" onClick={handlePasswordVerification} className="mt-2">
                  Forgot password?
                </Button> */}
              </div>
            </Form>
          ) : (
            <Form noValidate validated={validated} onSubmit={handleSignUp}>
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
                  id="floatingUsernameSignup"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <label htmlFor="floatingUsernameSignup">Username</label>
                <Form.Control.Feedback type="invalid">
                  Please enter a username.
                </Form.Control.Feedback>
              </Form.Floating>
              <Form.Floating className="mb-3">
                <Form.Control
                  id="floatingNameSignup"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <label htmlFor="floatingNameSignup">Full Name</label>
                <Form.Control.Feedback type="invalid">
                  Please enter your name.
                </Form.Control.Feedback>
              </Form.Floating>
              <Form.Floating className="mb-3">
                <Form.Control
                  id="floatingSurnameSignup"
                  type="text"
                  placeholder="Enter your surname"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  required
                />
                <label htmlFor="floatingSurnameSignup">Surname</label>
                <Form.Control.Feedback type="invalid">
                  Please enter your surname.
                </Form.Control.Feedback>
              </Form.Floating>
              <Form.Floating className="mb-3">
                <Form.Control
                  id="floatingEmailSignup"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="floatingEmailSignup">Email address</label>
                <Form.Control.Feedback type="invalid">
                  Please enter a valid email address.
                </Form.Control.Feedback>
              </Form.Floating>
              <Form.Floating className="mb-3">
                <Form.Control
                  id="floatingPasswordSignup"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label htmlFor="floatingPasswordSignup">Password</label>
                <span
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  style={{ cursor: 'pointer' }}
                >
                  {showPassword ? "Hide password" : "Show password"}
                </span>
                <Form.Control.Feedback type="invalid">
                  Please enter a password.
                </Form.Control.Feedback>
              </Form.Floating>
              <Form.Floating className="mb-3">
                <Form.Control
                  id="floatingConfirmPasswordSignup"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <label htmlFor="floatingConfirmPasswordSignup">Confirm Password</label>
                <Form.Control.Feedback type="invalid">
                  Please confirm your password.
                </Form.Control.Feedback>
              </Form.Floating>
              <Form.Floating className="mb-3">
                <Form.Select
                  id="floatingRoleSignup"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="">Select role</option>
                  <option value="client">Client</option>
                  <option value="customer">Customer</option>
                </Form.Select>
                <label htmlFor="floatingRoleSignup">Role</label>
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
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}
