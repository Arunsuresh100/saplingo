// src/routing/AdminProtectedRoute.js

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const AdminProtectedRoute = () => {
  const { userInfo, loading } = useUser();

  if (loading) {
    return null; // Or a loading spinner
  }

  // User must be logged in AND must be an admin.
  return userInfo && userInfo.isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminProtectedRoute;