import { useEffect, useState, Fragment } from 'react';
import { Container, Row, Col, Table, Spinner, Form } from 'react-bootstrap';
import { getLogs } from '../../../services/users';
import { format } from 'date-fns';

const Logs = () => {
  const [logs, setLogs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await getLogs();
        const combinedLogs = [
          ...data.users.map(log => ({ ...log, content: 'User' })),
          ...data.reviews.map(log => ({ ...log, content: 'Review' })),
          ...data.restaurants.map(log => ({ ...log, content: 'Restaurant' }))
        ];
        const sortedLogs = combinedLogs.sort((a, b) => new Date(b.date) - new Date(a.date));
        setLogs(sortedLogs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  useEffect(() => {
    const filtered = logs.filter(log =>
      log.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredLogs(filtered);
  }, [searchQuery, logs]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  const renderLogEntry = (log, index) => (
    <Fragment key={index}>
      <tr>
        <td>{index + 1}</td>
        <td>
          {`Type: ${log.type}, Content: ${log.content}, Date: ${format(new Date(log.date), 'dd-MM-yyyy HH:mm:ss')}, 
          ${log.content === 'User' ? `Username: ${log.username}, Role: ${log.role}` 
          : log.content === 'Review' ? `Review ID: ${log.reviewId}, Created By: ${log.username}, Restaurant Name: ${log.restaurant}` 
          : `User ID: ${log.userId}, Username: ${log.username}, Restaurant Name: ${log.restaurant}`}`}
        </td>
      </tr>
    </Fragment>
  );

  return (
    <Container>
      {error && <p className="alert alert-danger">{error}</p>}
      <Row className="py-4">
        <Col>
        <Form className="mb-3">
            <Form.Control
              type="search"
              placeholder="Search by Type or Content or Username"
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Form>

          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Log Entry</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, index) => renderLogEntry(log, index))}
            </tbody>
          </Table>

        </Col>
      </Row>
    </Container>
  );
}

export default Logs;