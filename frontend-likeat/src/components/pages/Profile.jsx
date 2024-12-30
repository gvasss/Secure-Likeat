import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Spinner, Modal, Form, Alert } from 'react-bootstrap';
import { getProfile, deleteClient, deleteCustomer, changePassword } from '../../services/users';
import { useAuth } from '../../context/AuthContext'

const Profile = () => {
  const [userProfile, setUserProfile] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const Auth = useAuth();
  const user = Auth.user;

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmationPassword, setConfirmationPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const profileData = await getProfile();
      setUserProfile(profileData);
      setLoading(false);
    } catch {
      setError('Failed to load user profile');
      setLoading(false);
    }
  };

  const deleteEndpoint = user?.roles 
  ? {
      CUSTOMER: deleteCustomer,
      CLIENT: deleteClient,
    }[user.roles]
  : null;

  const handleDeleteUser = async () => {
    if (!deleteEndpoint) {
      setError('You do not have permission to delete this user.');
      return;
    }

    try {
      await deleteEndpoint();
      Auth.logOut();
      navigate("/");
    } catch {
      setError(`Failed to delete ${user.username}.`);
    }
  };

  const handlePasswordSubmit = async () => {
    if (newPassword !== confirmationPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    try {
      const passwordData = { currentPassword, newPassword, confirmationPassword };
      await changePassword(passwordData);
      setShowPasswordModal(false);

      setAlertMessage('Password changed successfully.');
      setAlertVariant('success');
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);

      setCurrentPassword('');
      setNewPassword('');
      setConfirmationPassword('');
      setPasswordError('');
    } catch {
      setPasswordError('Failed to change password');
    }
  };

  const handleModalClose = () => {
    setShowPasswordModal(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmationPassword('');
    setPasswordError('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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

  const handleChangePassword = () => {
    setShowPasswordModal(true);
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
          <Card.Text><strong>Username:</strong> {userProfile.username}</Card.Text>
          <Card.Text><strong>Name:</strong> {userProfile.name}</Card.Text>
          <Card.Text><strong>Surname:</strong> {userProfile.surname}</Card.Text>
          <Card.Text><strong>Email:</strong> {userProfile.email}</Card.Text>
        </Card.Body>
      </Card>
      <div className="mt-4"></div>
      <Link className="btn btn-secondary mx-2" to={`/edituser/${userProfile.id}`}>
        <i className="fas fa-edit"></i> Edit Profile
      </Link>
      <Button className="btn btn-dark mx-2" onClick={handleChangePassword}>
        <i className="fas fa-edit"></i> Change Password
      </Button>
      {user.roles !== 'ADMIN' && (
        <Button className="btn btn-danger mx-2" onClick={handleDeleteModalShow}>
          <i className="fas fa-trash-alt"></i> Delete Account
        </Button>
      )}

      <Modal show={showPasswordModal} onHide={handleModalClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
            <Form.Floating className="mb-3">
              <Form.Control
                id="currentPassword"
                type={showPassword ? "text" : "password"}
                placeholder=""
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <label htmlFor="currentPassword">Current Password</label>
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
                  Please enter your current password.
              </Form.Control.Feedback>
            </Form.Floating>
            <Form.Floating className="mb-3">
              <Form.Control
                id="newPassword"
                type="password"
                placeholder=""
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <label htmlFor="newPassword">New Password</label>
              <Form.Control.Feedback type="invalid">
                  Please enter your new password.
              </Form.Control.Feedback>
            </Form.Floating>
            <Form.Floating className="mb-3">
              <Form.Control
                id="confirmationPassword"
                type="password"
                placeholder=""
                value={confirmationPassword}
                onChange={(e) => setConfirmationPassword(e.target.value)}
                required
              />
              <label htmlFor="confirmationPassword">Confirm new Password</label>
              <Form.Control.Feedback type="invalid">
                  Please confirm your new password.
              </Form.Control.Feedback>
            </Form.Floating>
            {passwordError && <Alert variant="danger">{passwordError}</Alert>}
          </Form>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button variant="danger" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button variant="dark" onClick={handlePasswordSubmit}>
            Change Password
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
        <Modal.Footer className="d-flex justify-content-center">
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

export default Profile;