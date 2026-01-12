import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // Check if the "admin_key" exists in the browser's memory
  const isAuthenticated = localStorage.getItem("wefpro_admin_key");

  // If NO key, redirect to Login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If YES key, show the Admin Page
  return children;
};

export default PrivateRoute;