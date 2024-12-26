import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import './SignInUp.css';
import Login from './Login';
import Register from './Register';

const SignInUp = () => {
  const [show, setShow] = useState(false);
  const [authMode, setAuthMode] = useState("signin");

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => setShow(true);

  const changeAuthMode = () => {
    setAuthMode(authMode === "signin" ? "signup" : "signin");
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
            <Login changeAuthMode={changeAuthMode} setShow={setShow} />
          ) : (
            <Register changeAuthMode={changeAuthMode} setShow={setShow} />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default SignInUp;