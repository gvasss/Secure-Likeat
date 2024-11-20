import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import UserLogin from '../pages/UserLogin';
import './Navbar.css';
import homeIcon from '../logo7.png';
import { Badge } from 'react-bootstrap';

export default function Navbar({ userRole, setUserRole }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const handleLogout = () => {
    setUserRole("");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    if (showLoginPopup) {
      const timer = setTimeout(() => {
        setShowLoginPopup(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showLoginPopup]);

  useEffect(() => {
    if (userRole === 'client') {
      fetchPendingCount();
    }
  }, [userRole]);

  const fetchPendingCount = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const result = await axios.get(`http://localhost:8080/client/${userId}/restaurants`);
      const pendingRestaurants = result.data.filter(restaurant => restaurant.status === 'PENDING');
      setPendingCount(pendingRestaurants.length);
    } catch (error) {
      console.error("Error fetching pending count", error);
    }
  };

  return (
    <div className="navbar-wrapper">
      <div className="navbar-left">
        <div className={`navbar-option home ${isActive('/') ? 'checked' : ''}`}>
          <Link to="/" className="navbar-input">
            <div className="navbar-btn">
              <img src={homeIcon} alt="Home" className="navbar-icon" />
            </div>
          </Link>
        </div>
      </div>
      <div className="navbar-right">
        {userRole === '' && (
          <div className="navbar-option sign">
            <UserLogin setUserRole={setUserRole} />
            {showLoginPopup && (
              <div className="login-popup">
                Please sign in to view restaurant details.
              </div>
            )}
          </div>
        )}
        {userRole === 'admin' && (
          <>
            <div className="navbar-option">
              <Link to="/dashboard" className={`navbar-input ${isActive('/dashboard') ? 'checked' : ''}`}>
                <div className="navbar-btn">
                  <span className="navbar-span">Dashboard</span>
                </div>
              </Link>
            </div>
            <div className="navbar-option">
              <Link to="/profile" className={`navbar-input ${isActive('/profile') ? 'checked' : ''}`}>
                <div className="navbar-btn">
                  <span className="navbar-span">My Profile</span>
                </div>
              </Link>
            </div>
          </>
        )}
        {userRole === 'customer' && (
          <>
            <div className="navbar-option">
              <Link to="/customerreview" className={`navbar-input ${isActive('/customerreview') ? 'checked' : ''}`}>
                <div className="navbar-btn">
                  <span className="navbar-span">Reviews</span>
                </div>
              </Link>
            </div>
            <div className="navbar-option">
              <Link to="/profile" className={`navbar-input ${isActive('/profile') ? 'checked' : ''}`}>
                <div className="navbar-btn">
                  <span className="navbar-span">My Profile</span>
                </div>
              </Link>
            </div>
          </>
        )}
        {userRole === 'client' && (
          <>
            <div className="navbar-option">
              <Link to="/clientrestaurant" className={`navbar-input ${isActive('/clientrestaurant') ? 'checked' : ''}`}>
                <div className="navbar-btn">
                  <span className="navbar-span">Restaurants</span>
                  {pendingCount > 0 && <Badge bg="secondary" className="ms-2">{pendingCount}</Badge>}
                </div>
              </Link>
            </div>
            <div className="navbar-option">
              <Link to="/profile" className={`navbar-input ${isActive('/profile') ? 'checked' : ''}`}>
                <div className="navbar-btn">
                  <span className="navbar-span">My Profile</span>
                </div>
              </Link>
            </div>
          </>
        )}
        {userRole !== '' && (
          <div className="navbar-option logout">
            <button className="navbar-input navbar-btn" onClick={handleLogout}>
              <span className="navbar-span">Logout</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
