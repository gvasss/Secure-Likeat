import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Spinner, Modal, Form, Alert } from 'react-bootstrap';

export default function Profile() {
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const [user, setUser] = useState({
    id: "",
    username: "",
    name: "",
    surname: "",
    password: "",
    email: "",
    role: "",
    location: ""
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordStep, setPasswordStep] = useState(1);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('');

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadUserAndReviews();
  }, []);

  const loadUserAndReviews = async () => {
    try {
      const userResult = await axios.get(`http://localhost:8080/user/${userId}`);
      const userData = userResult.data;
      setUser(userData);

      if (userData.role === 'customer') {
        const reviewsResult = await axios.get(`http://localhost:8080/customer/${userId}/reviews`);
        setReviewCount(reviewsResult.data.length);
      }

      setLoading(false);
    } catch (err) {
      setError('Failed to load user or reviews.');
      setLoading(false);
      console.error(err);
    }
  };

  const handleDeleteUser = async () => {
    const deleteEndpoint = {
      customer: `http://localhost:8080/customer/${user.id}`,
      client: `http://localhost:8080/client/${user.id}`,
      admin: `http://localhost:8080/admin/${user.id}`
    }[user.role];

    try {
      await axios.delete(deleteEndpoint);
      navigate("/");
    } catch (err) {
      console.error(`Failed to delete ${user.role}:`, err);
      setError(`Failed to delete ${user.role}.`);
    }
  };

  const handleChangePassword = () => {
    setShowPasswordModal(true);
    setPasswordStep(1);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setPasswordError('');
    setNewPasswordError('');
  };

  const handlePasswordSubmit = async () => {
    if (passwordStep === 1) {
      try {
        await axios.post(`http://localhost:8080/user/${user.id}/verify-password`, { currentPassword });
        setPasswordStep(2);
        setPasswordError('');
      } catch (err) {
        setPasswordError('Current password is incorrect.');
      }
    } else if (passwordStep === 2) {
      if (newPassword === confirmNewPassword) {
        try {
          await axios.put(`http://localhost:8080/user/${user.id}/password`, { password: newPassword });
          setShowPasswordModal(false);
          setAlertMessage('Password changed successfully.');
          setAlertVariant('success');
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
          }, 2500);
        } catch (err) {
          console.error('Failed to change password:', err);
          setAlertMessage('Failed to change password.');
          setAlertVariant('danger');
          setShowAlert(true);
        }
      } else {
        setNewPasswordError('New passwords do not match.');
      }
    }
  };

  const handleModalClose = () => {
    setShowPasswordModal(false);
    setPasswordStep(1);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setPasswordError('');
    setNewPasswordError('');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handlePasswordSubmit();
    }
  };

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteModalShow = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    handleDeleteUser();
    setShowDeleteModal(false);
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

  if (error) return <p>{error}</p>;

  return (
    <Container className="py-4">
      {showAlert && <Alert variant={alertVariant}>{alertMessage}</Alert>}
      <i className="fas fa-user-circle fa-4x"></i>
      <h3 className="text-center m-3 mb-4">User Profile</h3>
      <Card className="text-center mx-auto" style={{ maxWidth: '600px' }} border="dark">
        <Card.Body >
          <Card.Text><strong>Username:</strong> {user.username}</Card.Text>
          <Card.Text><strong>Name:</strong> {user.name}</Card.Text>
          <Card.Text><strong>Surname:</strong> {user.surname}</Card.Text>
          <Card.Text><strong>Email:</strong> {user.email}</Card.Text>
          {user.role === 'customer' && (
            <>
              <Card.Text><strong>Location:</strong> {user.location}</Card.Text>
              <Card.Text><strong>Reviews:</strong> {reviewCount}</Card.Text>
            </>
          )}
        </Card.Body>
      </Card>
      <div className="mt-4"></div>
      <Link className="btn btn-secondary mx-2" to={`/edituser/${user.id}`}>
        <i className="fas fa-edit"></i> Edit Profile
      </Link>
      <Button className="btn btn-dark mx-2" onClick={handleChangePassword}>
        <i className="fas fa-edit"></i> Change Password
      </Button>
      {user.role !== 'admin' && (
        <Button className="btn btn-danger mx-2" onClick={handleDeleteModalShow}>
          <i className="fas fa-trash-alt"></i> Delete Account
        </Button>
      )}

      <Modal show={showPasswordModal} onHide={handleModalClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {passwordStep === 1 && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Current Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </Form.Group>
              {passwordError && <Alert variant="danger">{passwordError}</Alert>}
            </Form>
          )}
          {passwordStep === 2 && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </Form.Group>
              {newPasswordError && <Alert variant="danger">{newPasswordError}</Alert>}
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button variant="dark" onClick={handlePasswordSubmit}>
            {passwordStep === 1 ? 'Next' : 'Change Password'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={handleDeleteModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete your account? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={handleDeleteModalClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
