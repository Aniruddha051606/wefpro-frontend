import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // UI Check: Does the user look logged in?
  // Real security is enforced by the backend API cookies.
  const isAuthenticated = localStorage.getItem("wefpro_admin_key");

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;