// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { subscribeToAuthChanges } from '../firebase/authService';

const AuthContext = createContext();

// Hook personalizado para consumir el contexto fácilmente
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Para saber si Firebase ya verificó el estado

  useEffect(() => {
    // onAuthStateChanged devuelve una función 'unsubscribe'
    const unsubscribe = subscribeToAuthChanges((user) => {
      setCurrentUser(user);
      setLoading(false); // Firebase ya respondió, podemos mostrar la app
    });

    // Limpiar la suscripción al desmontar el componente para evitar fugas de memoria
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
  };

  // No renderizamos la app hasta que sepamos si hay un usuario o no
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};