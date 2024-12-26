import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Login from '../components/login/SignInUp';
import './Navbar.css';
import homeIcon from '../logo7.png';
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const Auth = useAuth();
  const user = Auth.user;
  const logOut = Auth.logOut;

  useEffect(() => {
    if (showLoginPopup) {
      const timer = setTimeout(() => {
        setShowLoginPopup(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showLoginPopup]);

  const handleLogout = () => {
    logOut();
    navigate("/");
  };

  const AdminLinks = () => (
      <div className="navbar-option">
        <Link to="/dashboard" className={`navbar-input ${isActive('/dashboard') ? 'checked' : ''}`}>
          <div className="navbar-btn">
            <span className="navbar-span">Dashboard</span>
          </div>
        </Link>
      </div>
  );

  const CustomerLinks = () => (
    <div className="navbar-option">
      <Link to="/customer/reviews" className={`navbar-input ${isActive('/customer/reviews') ? 'checked' : ''}`}>
        <div className="navbar-btn">
          <span className="navbar-span">Reviews</span>
        </div>
      </Link>
    </div>
  );

  const ClientLinks = () => (
    <div className="navbar-option">
      <Link to="/client/restaurants" className={`navbar-input ${isActive('/client/restaurants') ? 'checked' : ''}`}>
        <div className="navbar-btn">
          <span className="navbar-span">Restaurants</span>
        </div>
      </Link>
    </div>
  );

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
        {!user && (
          <div className="navbar-option sign">
            <Login />
            {showLoginPopup && (
              <div className="login-popup">
                Please sign in to view restaurant details.
              </div>
            )}
          </div>
        )}
        {user && user.roles.includes('ADMIN') && <AdminLinks />}
        {user && user.roles.includes('CUSTOMER') && <CustomerLinks />}
        {user && user.roles.includes('CLIENT') && <ClientLinks />}
        {user && (
          <>
            <div className="navbar-option">
              <Link to="/profile" className={`navbar-input ${isActive('/profile') ? 'checked' : ''}`}>
                <div className="navbar-btn">
                  <span className="navbar-span">My Profile</span>
                </div>
              </Link>
            </div>
            <div className="navbar-option logout">
              <button className="navbar-input navbar-btn" onClick={handleLogout}>
                <span className="navbar-span">Logout</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;