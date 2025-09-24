// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // Si no hay usuario, redirige a la página de login
    return <Navigate to="/login" />;
  }

  // Si hay usuario, renderiza el componente hijo (la página protegida)
  return children;
};

export default ProtectedRoute;