import { useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
  const { isUserAuthenticated } = useAuth()
  const navigate = useNavigate();

  useEffect(() => {
    if (!isUserAuthenticated()) {
      navigate("/")
    }
  })

  return isUserAuthenticated() ? children : "";
}

ProtectedRoute.propTypes = {
  children: PropTypes.object.isRequired,
};

export default ProtectedRoute;