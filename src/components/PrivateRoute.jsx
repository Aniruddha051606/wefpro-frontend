import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // Check if the user has the "Key" in their pocket
  const isAuthenticated = localStorage.getItem("authToken");

  // If they have the key, let them in (render children).
  // If not, kick them back to Login page.
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;