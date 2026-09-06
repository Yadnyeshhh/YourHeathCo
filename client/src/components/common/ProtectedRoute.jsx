import React from 'react';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const adminToken = localStorage.getItem('adminToken');

  if (!token) {
    if (adminToken) {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/login" replace />;
  }
  return children;
};

export const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const adminToken = localStorage.getItem('adminToken');

  if (!adminToken) {
    if (token) {
      return <Navigate to="/pdashboard" replace />;
    }
    return <Navigate to="/login" replace />;
  }
  return children;
};
