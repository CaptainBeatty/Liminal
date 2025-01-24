import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // Décoder l'utilisateur à partir du token si nécessaire
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Exemple JWT
      setCurrentUserId(decodedToken.userId);
    } else {
      setIsAuthenticated(false);
      setCurrentUserId(null);
    }
  }, []);

  const onLogin = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    const decodedToken = JSON.parse(atob(token.split('.')[1])); // Exemple JWT
    setCurrentUserId(decodedToken.userId);
  };

  const onLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setCurrentUserId(null); // Déconnecte l'utilisateur
  };
  

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUserId, onLogin, onLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
