import React from 'react';
import { Navigate } from 'react-router-dom';

const Pro = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem('token'); 

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default Pro;
