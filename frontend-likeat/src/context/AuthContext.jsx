/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import authentication from "../services/authentication.js";
import jwtDecode from "jwt-decode";

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const { authenticate } = authentication;

  const isTokenValid = (token) => {
    const parts = token.split('.');
    return parts.length === 3;
  }

  const setUserFromToken = () => {
    let token = localStorage.getItem("access_token");
    if (token && isTokenValid(token)) {
        try {
            const decodedToken = jwtDecode(token);
            setUser({
                username: decodedToken.sub,
                roles: decodedToken.role
            });
        } catch (error) {
            console.error("Error decoding token:", error);
            localStorage.removeItem("access_token");
            setUser(null);
        }
    } else {
        setUser(null);
    }
  }

  useEffect(() => {
    setUserFromToken()
  }, [])

  const login = async (usernameAndPassword) => {
    try {
        const response = await authenticate(usernameAndPassword);
        const jwtToken = response.data.access_token;
        if (jwtToken) {
            localStorage.setItem("access_token", jwtToken);
        }
        const decodedToken = jwtDecode(jwtToken);
        setUser({
            username: decodedToken.sub,
            roles: decodedToken.role
        });
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
  }

  const logOut = () => {
      localStorage.removeItem("access_token")
      setUser(null)
  }

  const isUserAuthenticated = () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
          return false;
      }
      const { exp: expiration } = jwtDecode(token);
      if (Date.now() > expiration * 1000) {
          logOut()
          return false;
      }
      return true;
  }

  return (
    <AuthContext.Provider value={{
        user,
        login,
        logOut,
        isUserAuthenticated,
        setUserFromToken
    }}>
        {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;