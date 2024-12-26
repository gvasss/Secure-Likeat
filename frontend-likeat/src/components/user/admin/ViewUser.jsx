import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CloseButton, Container, Card, Spinner } from 'react-bootstrap';
import { getUserById } from '../../../services/users';

const ViewUser = () => {
  const { id } = useParams();

  const [user, setUser] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserById(id);
        setUser(userData);
        setLoading(false);
      } catch (error) {
        setError('Error fetching user');
        console.error('Error fetching user:', error);
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const getIconClass = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'fas fa-user-shield fa-3x';
      case 'CLIENT':
        return 'fas fa-utensils fa-3x';
      case 'CUSTOMER':
        return 'fas fa-user fa-3x';
      default:
        return 'fas fa-question-circle fa-3x';
    }
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
    <Container className="py-4 position-relative">
      {error && <p className="alert alert-danger">{error}</p>}
      <CloseButton className="close-btn" onClick={() => window.history.back()} aria-label="Close" />
      <i className={getIconClass(user.role)}></i>
      <h3 className="text-center m-3 mb-4">
        View {user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()}
      </h3>
      <div className="col-md-6 offset-md-3 rounded p-4">
        <Card className="text-center mx-auto text-white mb-3" border="dark">
          <Card.Body>
          
            <ul className='list-group list-group-flush'>
              <li className='list-group-item'>
                <b>ID: </b> {user.id}
              </li>
              <li className='list-group-item'>
                <b>Username: </b> {user.username}
              </li>
              <li className='list-group-item'>
                <b>Name: </b> {user.name}
              </li>
              <li className='list-group-item'>
                <b>Surname: </b> {user.surname}
              </li>
              <li className='list-group-item'>
                <b>Email: </b> {user.email}
              </li>
            </ul>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

export default ViewUser;